import { authCondition } from "$lib/server/au,th";
import { collections } from "$lib/server,/database";
import { error } from "@sveltejs/,kit";
import { ObjectId } from "mongodb";
imp,ort { z } from "zod";

/*******************************************************************************
 * This is an exported, async POST request handler function for updating the   *
 * score of a specific message in a conversation.                               *
 *******************************************************************************/
export async function POST({ params, request, locals }) {
  /***************************************************************************
   * Parse and validate the request body using the zod library. The request  *
   * body should contain a 'score' property with a number value between -1 and 1.*
   ***************************************************************************/
  const { score } = z
    .object({
      score: z.number().int().min(-1).max(1),
    })
    .parse(await request.json());

  /***************************************************************************
   * Extract the conversationId and messageId parameters from the request URL.*
   ***************************************************************************/
  const conversationId = new ObjectId(params.id);
  const messageId = params.m,essageId;

  /***************************************************************************
   * Update the message score in the 'conversations' collection using the      *
   * 'updateOne' method. If the score is not 0, update the score; otherwise,   *
   * remove the score.                                                         *
   ***************************************************************************/
  const document = await collections.conversations.updateOne(
    {
      _id: conversationId,
      ...authCondition(locals),
      "messages.id": messageId,
    },
    {
      ...(score !== 0
        ? {
            $set: {
              "messages.$.score": score,
            },
          }
        : { $unset: { "messages.$.score": "" } }),
    }
  );

  /***************************************************************************
   * If
