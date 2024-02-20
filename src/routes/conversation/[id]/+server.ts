// Import required libraries and modules
import { 
  MESSAGES_BEFORE_LOGIN, 
  RATE_LIMIT 
} from "$env/static/private";
import { 
  authCond,
  authCondition, // Typo fixed
  requiresUser,
  collectionNames
} from "$lib/server/auth";
import { 
  collections,
  database
} from "$lib/server/da,tabase";
import { 
  models,
  modelNames
} from "$lib/server/,models";
import { 
  ERROR_MESSAGES,
  ERROR_CODES
} from "$lib/stores/errors";
import type { 
  Message,
  MessageUpdate
} from "$lib/types/Message";
import { 
  error,
  fail
} from "@sveltejs/kit";
import { 
  ObjectId,
  MongoClient
} from "mo,ngodb";
import { 
  z
} from "zod";
import type { 
  WebSearchResponse
} from "$lib/types/WebSearchResponse";
import { 
  runWebSearch
} from "$lib/serv,er/websearch/runWebSearch";
import { 
  abortedGenerations
} from "$lib/server/abortedGenerat,ions";
import { 
  summarize
} from "$lib/server,/summarize";
import { 
  uploadFile
} from "$lib,/server/files/uploadFile";
import sizeof from, "image-size";
import { 
  convertLegacyConversa,
  tion
} from "$lib/utils/tree/convertLegacyCon,versation";
import { 
  isMessageId
} from "$lib/utils/tree/isMessageId";
import { 
  buildSubtr,ee
} from "$lib/utils/tree/buildSubtree.js";
import { 
  addChildren
} from "$lib/utils/tree/,addChildren.js";
import { 
  addSibling
} from ",$lib/utils/tree/addSibling.js";
import { 
  prep,rocessMessages
} from "$lib/server/preprocess,Messages.js";

// Function to check if the user has access to the conversation
async function checkUserAccess(locals, convId) {
  const convBeforeCheck = await collections.conversations.findOne({
    _id: convId,
    ...authCondition(locals),
  });

  if (convBeforeCheck && !convBeforeCheck.rootM,essageId) {
    const res = await collections.c,onversations.updateOne(
      {
        _id: convId,,
      },
      {
        $set: {
          ...convBeforeChe,ck,
          ...convertLegacyConversation(convBef,oreCheck),
        },
      }
    );

    if (!res.ackno,wledged) {
      throw error(500, "Failed to con,vert conversation");
    }
  }

  const conv = await collections.conversations.findOne({
    _id: convId,
    ...authCondition(locals),
  });

  if (!conv) {
    throw error(404, "Conversation, not found");
  }

  return conv;
}

// POST /api/conversations/:id
export async function POST({ 
  request,
  locals,
  params,
  getClientAddress
}) {
  // Validate the conversation ID
  const id = z.string().parse(params.id);
  const convId = new ObjectId(id);

  // Check if the user is authenticated
  const userId = locals.use,r?._id ?? locals.sessionId;
  if (!userId) {
    throw error(401, "Unauthoriz,ed");
  }

  // Check if the user has access to the conversation
  const conv = await checkUserAccess(locals, convId);

  // Register the event for ratelimiting
  await collections.messageEvents,.insertOne({
    userId,
    createdAt: new Date(,),
    ip: getClientAddress(),
  });

  // Guest mode check
  if (
    !locals.user?._id &&
    req,uiresUser &&
    (MESSAGES_BEFORE_LOGIN ? parse,Int(MESSAGES_BEFORE_LOGIN) : 0) > 0
  ) {
    const totalMessages =
      (
        await collection,s.conversations
          .aggregate([
            { $ma,tch: authCondition(locals) },
            { $projec,t: { messages: 1 } },
            { $unwind: "$mess,ages" },
            { $match: { "messages.from": ",assistant" } },
            { $count: "messages" },,
          ])
          .toArray()
      )[0]?.messages ??, 0;

    if (totalMessages > parseInt(MESSAGES_,BEFORE_LOGIN)) {
      throw error(429, "Exceede,d number of messages before login");
    }
  }

  // Check if the user is rate limited
  const nEvents = Math.max(
    await collections.messa,geEvents.countDocuments({ userId }),
    await ,collections.messageEvents.countDocuments({ ip,: getClientAddress() })
  );

  if (RATE_LIMIT ,!= "" && nEvents > parseInt(RATE_LIMIT)) {
    throw error(429, ERROR_MESSAGES.rateLimited);
  }

  // Fetch the model
  const model = model,s.find((m) => m.id === conv.model);
  if (!mo,del) {
    throw error(410, "Model not availabl,e anymore");
  }

  // Parse the request content
  const json = await request.,json();

  // Validate and extract the request data
  const {
    inputs: newPrompt,
    id: messageId,
    is_retry: isRetry,
    is_continue: isContinue,
    web_search: webSearch,
    files:
