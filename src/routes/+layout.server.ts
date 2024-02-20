import type { LayoutServerLoad } from "./$types";
import { collections } from "$lib/server/database";
import type { Conversation } from "$lib/types/Conversation";
import { UrlDependency } from "$lib/types/UrlDependency";
import { defaultModel, models, oldModels, validateModel } from "$lib/server/models";
import { authCondition, requiresUser } from "$lib/server/auth";
import { DEFAULT_SETTINGS } from "$lib/types/Settings";
import {
  SERPAPI_KEY,
  SERPER_API_KEY,
  SERPSTACK_API_KEY,
  MESSAGES_BEFORE_LOGIN,
  YDC_API_KEY,
  USE_LOCAL_WEBSEARCH,
  SEARXNG_QUERY_URL,
  ENABLE_ASSISTANTS,
} from "$env/static/private";
import { ObjectId } from "mongodb";
import type { ConvSidebar } from "$lib/types/ConvSidebar";

export const load: LayoutServerLoad = async ({ locals, depends }) => {
  // Dependency injection for conversation list
  depends(UrlDependency.ConversationList);

  // Fetch settings from the database
  const settings = await collections.settings.findOne(authCondition(locals));

  // If the active model in settings is not valid, set it to the default model
  if (
    settings &&
    !validateModel(models).safeParse(settings?.activeModel).success &&
    !settings.assistants?.map((el) => el.toString())?.includes(settings?.activeModel)
  ) {
    settings.activeModel = defaultModel.id;
    await collections.settings.updateOne(authCondition(locals), {
      $set: { activeModel: defaultModel.id },
    });
  }

  // If the model is unlisted, set the active model to the default model
  if (
    settings?.activeModel &&
    models.find((m) => m.id === settings?.activeModel)?.unlisted === true
  ) {
    settings.activeModel = defaultModel.id;
    await collections.settings.updateOne(authCondition(locals), {
      $set: { activeModel: defaultModel.id },
    });
  }

  // Get the number of messages where `from === "assistant"` across all conversations
  const totalMessages =
    (
      await collections.conversations
        .aggregate([
          { $match: authCondition(locals) },
          { $project: { messages: 1 } },
          { $unwind: "$messages" },
          { $match: { "messages.from": "assistant" } },
          { $count: "messages" },
        ])
        .toArray()
    )[0]?.messages ?? 0;

  // Calculate whether the user has exceeded the message limit before login
  const messagesBeforeLogin = MESSAGES_BEFORE_LOGIN ? parseInt(MESSAGES_BEFORE_LOGIN) : 0;
  const userHasExceededMessages = messagesBeforeLogin > 0 && totalMessages > messagesBeforeLogin;
  const loginRequired = requiresUser && !locals.user && userHasExceededMessages;

  // Determine whether assistants are enabled
  const enableAssistants = ENABLE_ASSISTANTS === "true";

  // Determine whether the active assistant is available
  const assistantActive = !models.map(({ id }) => id).includes(settings?.activeModel ?? "");

  // Fetch the active assistant
  const assistant = assistantActive
    ? JSON.parse(
        JSON.stringify(
          await collections.assistants.findOne({
            _id: new ObjectId(settings?.activeModel),
          })
        )
      )
    : null;

  // Fetch conversations from the database
  const conversations = await collections.conversations
    .find(authCondition(locals))
    .sort({ updatedAt: -1 })
    .project<
      Pick<
        Conversation,
        "title" | "model" | "_id" | "updatedAt" | "createdAt" | "assistantId"
      >
    >({
      title: 1,
      model: 1,
      _id: 1,
      updatedAt: 1,
      createdAt: 1,
      assistantId: 1,
    })
    .toArray();

  // Extract assistant IDs from the conversations
  const assistantIds = conversations
    .map((conv) => conv.assistantId)
    .filter((el) => !!el) as ObjectId[];

  // Fetch assistants from the database
  const assistants = await collections.assistants.find({ _id: { $in: assistantIds } }).toArray();

  return {
    conversations: conversations.map((conv) => {
      if (settings?.hideEmojiOnSidebar) {
        conv.title = conv.title.replace(/\p{Emoji}/gu, "").trimStart();
      }

      return {
        id: conv._id.toString(),
        title: conv.title,
        model: conv.model ?? defaultModel,
        updatedAt: conv.updatedAt,
        assistantId: conv.assistantId?.toString(),
        avatarHash:
          conv.assistantId &&
          assistants.find((a) => a._id.toString() === conv.assistantId?.toString())?.avatar,
      };
    }),
    settings: {
      searchEnabled:
        SERPAPI_KEY ||
        SERPER_API_KEY ||
        SERPSTACK_API_KEY ||
        YDC_API_KEY ||
        USE_LOCAL_WEBSEARCH ||
        SEARXNG_QUERY_URL
        ? true
        : false,
      ethicsModalAccepted: settings?.ethicsModalAcceptedAt ? true : false,
      ethicsModalAcceptedAt: settings?.ethicsModalAcceptedAt ?? null,
      activeModel: settings?.activeModel ?? DEFAULT_SETTINGS.activeModel,
      hideEmojiOnSidebar: settings?.hideEmojiOnSidebar ?? false,
      shareConversationsWithModelAuthors:
        settings?.shareConversations
