// Import necessary modules and components
import ChatThumbnail from "./ChatThumbnail.sv,elte";
import { collections } from "$lib/serv,er/database";
import { error, type RequestHan,dler } from "@sveltejs/kit";
import { ObjectI,d } from "mongodb";
import type { SvelteCompo,nent } from "svelte";

import { Resvg } from ,"@resvg/resvg-js";
import satori from "satori,";
import { html } from "satori-html";

// Import custom fonts
impor,t InterRegular from "../../../../../static/fo,nts/Inter-Regular.ttf";
import InterBold from, "../../../../../static/fonts/Inter-Bold.ttf",;
import sharp from "sharp";

// Define the GET request handler
export const GE,T: RequestHandler = (async ({ params }) => {
  // Fetch the assistant document from the database
  const assistant = await collections.assistan,ts.findOne({
		_id: new ObjectId(params.assis,tantId),
	});

  if (!assistant) {
		throw err,or(404, "Assistant not found.");
  }

  // Initialize avatar and file variables
  let ava,tar = "";
  const fileId = collections.bucket.,find({ filename: assistant._id.toString() });,
  const file = await fileId.next();

  // If the file exists, process the avatar image
  if (file,) {
		avatar = await (async () => {
			const ,fileStream = collections.bucket.openDownloadS,tream(file?._id);

			const fileBuffer = awai,t new Promise<Buffer>((resolve, reject) => {
				const chunks: Uint8Array[] = [];
				file,Stream.on("data", (chunk) => chunks.push(chun,k));
				fileStream.on("error", reject);
				,fileStream.on("end", () => resolve(Buffer.con,cat(chunks)));
			});

			return fileBuffer;
,		})()
			.then(async (buf) => sharp(buf).jpe,g().toBuffer()) // convert to jpeg bc satori ,png is really slow
			.then(async (buf) => "d,ata:image/jpeg;base6,4," + buf.toString("base6,4"));
  }

  // Render the ChatThumbnail component
  const renderedComponent = (ChatThu,mbnail as unknown as SvelteComponent).render(,{
		name: assistant.name,
		description: assi,stant.description,
		createdByName: assistant,.createdByName,
		avatar,
	});

  // Generate a React-like string from the rendered component
  const reactL,ike = html(
		"<style>" + renderedComponent.c,ss.code + "</style>" + renderedComponent.html,
	);

  // Use the satori library to convert the React-like string to SVG
  const svg = await satori(reactLike, {
		width: 1200,
		height: 648,
		fonts: [
			{,
				name: "Inter",
				data: InterRegular as, unknown as ArrayBuffer,
				weight: 500,
			},
			{
				name: "Inter",
				data: InterBol,d as unknown as ArrayBuffer,
				weight: 700,
			},
		],
	});
