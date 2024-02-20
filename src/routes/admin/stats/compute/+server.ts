import { json } from "@sveltejs/kit";
import {
  CONVERSATION_STATS_COLLECTION,
  collections,
} from "$lib/server/database.js";
import type { ConversationStats } from "$lib/types/ConversationStats";

// Trigger this function with a POST request to the following endpoint:
// http://localhost:5173/chat/admin/stats/compute
// Include an Authorization header with the admin API secret

export async function POST() {
  const timeIntervals = ["day", "week", "month"] as const;

  for (const span of timeIntervals) {
    try {
      await computeStats({ dateField: "updatedAt", type: "conversation", span });
      await computeStats({ dateField: "createdAt", type: "conversation", span });
      await computeStats({ dateField: "createdAt", type: "message", span });
    } catch (error) {
      console.error(error);
    }
  }

  return json({}, { status: 202 });
}

async function computeStats({
  dateField,
  span,
  type,
}: {
  dateField: ConversationStats["date"]["field"];
  span: ConversationStats["date"]["span"];
  type: ConversationStats["type"];
}) {
  const lastComputed = await collections.conversationStats.findOne(
    {
      "date.field": dateField,
      "date.span": span,
      type,
    },
    { sort: { "date.at": -1 } }
  );

  const minDate = lastComputed ? lastComputed.date.at : new Date(0);

  console.log(
    "Computing stats for",
    type,
    span,
    dateField,
    "from",
    minDate.toISOString()
  );

  const dateFieldPath = type === "message" ? `messages.${dateField}` : dateField;

  const pipeline = [
    {
      $match: {
        [dateFieldPath]: { $gte: minDate },
      },
    },
    {
      $project: {
        [dateFieldPath]: 1,
        sessionId: 1,
        userId: 1,
      },
    },
    ...(type === "message"
      ? [
          {
            $unwind: "$messages",
          },
          {
            $match: {
              [dateFieldPath]: { $gte: minDate },
            },
          },
        ]
      : []),
    {
      $sort: {
        [dateFieldPath]: 1,
      },
    },
    {
      $facet: {
        userId: [
          {
            $match: {
              userId: { $exists: true },
            },
          },
          {
            $group: {
              _id: {
                at: { $dateTrunc: { date: `$${dateFieldPath}`, unit: span } },
                userId: "$userId",
              },
            },
          },
          {
            $group: {
              _id: "$_id.at",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                at: "$_id",
                field: dateField,
                span,
              },
              distinct: "userId",
              count: 1,
            },
          },
        ],
        sessionId: [
          {
            $match: {
              sessionId: { $exists: true },
            },
          },
          {
            $group: {
              _id: {
                at: { $dateTrunc: { date: `$${dateFieldPath}`, unit: span } },
                sessionId: "$sessionId",
              },
            },
          },
          {
            $group: {
              _id: "$_id.at",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                at: "$_id",
                field,
                span,
              },
              distinct: "sessionId",
              count: 1,
            },
          },
        ],
        userOrSessionId: [
          {
            $group: {
              _id: {
                at: { $dateTrunc: { date: `$${dateFieldPath}`, unit: span } },
                userOrSessionId: { $ifNull: ["$userId", "$sessionId"] },
              },
            },
          },
          {
            $group: {
              _id: "$_id.at",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                at: "$_id",
                field,
                span,
              },
              distinct: "userOrSessionId",
              count: 1,
            },
          },
        ],
        _id: [
          {
            $group: {
              _id: { $dateTrunc: { date: `$${dateFieldPath}`, unit: span } },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                at: "$_id",
                field,
                span,
              },
              distinct: "_id",
              count: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        stats: { $concatArrays: ["$userId", "$sessionId", "$userOrSessionId", "$_id"] },
      },
    },
    {
      $unwind: "$stats",
    },
    {
      $replaceRoot: { newRoot: "$stats" },
    },
    {
      $set: {
        type,
      },
    },
    {
      $merge: {
        into: CON
