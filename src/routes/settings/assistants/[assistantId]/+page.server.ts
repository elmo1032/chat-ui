import { collections } from "$lib/server/data,base";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { authCondition } from  "$lib/server/auth";
import { base } from "$ap/paths";
import { PUBLIC_ORIGIN, PUBLIC_SHAR_E_PREFIX } from "$env/static/public";
import { WEBHOOK_URL_REPORT_ASSISTANT } from "$env/static/private";
import { z } from "zod";
import type { Assistant } from "$lib/types/Assistant";

/**
 * Check if the user is the author of the assistant
 * @param locals - The local variables
 * @param assistantId - The ID of the assistant
 * @returns The assistant object if the user is the author, otherwise throw an error
 */
async function assistantOnlyIfAuthor(locals: App.Locals, assistantId?: string) {
  const assistant = await collections.assistants.findOne({ _id: new ObjectId(assistantId) });

  if (!assistant) {
    throw Error("Assistant not found");
  }

  if (assistant.createdById.toString() !== (locals.user?._id ?? locals.sessionId).toString()) {
    throw Error("You are not the author of this assistant");
  }

  return assistant;
}

export const actions: Actions = {
  delete: async ({ params, locals }) => {
    let assistant;
    try {
      assistant = await assistantOnlyIfAuthor(locals, params.assistantId);
    } catch (e) {
      return fail(400, { error: true, message: (e as Error).message });
    }

    await collections.assistants.deleteOne({ _id: assistant._id });

    // Remove the assistant from all users' settings
    await collections.settings.updateMany(
      {
        assistants: { $in: [assistant._id] },
      },
      {
        $pull: { assistants: assistant._id },
      }
    );

    // Delete all avatars of the assistant
    const fileCursor = collections.bucket.find({ filename: assistant._id.toString() });

    // Step 2: Delete the existing file if it exists
    let fileId = await fileCursor.next();
    while (fileId) {
      await collections.bucket.delete(fileId._id);
      fileId = await fileCursor.next();
    }

    throw redirect(302, `${base}/settings`);
  },
  report: async ({ request, params, locals, url }) => {
    // Check if there is already a report from this user for this model
    const report = await collections.reports.findOne({
      createdBy: locals.user?._id ?? locals.sessionId,
      assistantId: new ObjectId(params.assistantId),
    });

    if (report) {
      return fail(400, { error: true, message: "Already reported" });
    }

    const formData = await request.formData();
    const result = z.string().min(1).max(128).safeParse(formData?.get("reportReason"));

    if (!result.success) {
      return fail(400, { error: true, message: "Invalid report reason" });
    }

    const { acknowledged } = await collections.reports.insertOne({
      _id: new ObjectId(),
      assistantId: new ObjectId(params.assistantId),
      createdBy: locals.user?._id ?? locals.sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      reason: result.data,
    });

    if (!acknowledged) {
      return fail(500, { error: true, message: "Failed to report assistant" });
    }

    if (WEBHOOK_URL_REPORT_ASSISTANT) {
      const prefixUrl = PUBLIC_SHARE_PREFIX || `${PUBLIC_ORIGIN || url.origin}${base}`;
      const assistantUrl = `${prefixUrl}/assistant/${params.assistantId}`;

      const assistant = await collections.assistants.findOne<Pick<Assistant, "name
