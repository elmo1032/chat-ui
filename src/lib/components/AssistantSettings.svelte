<script lang="ts">
	// Import necessary modules and types
	import type { readAndComp, ressImage } from "browser-image-resizer";
	import type { Model } from "$lib/types/Model";
	import type { Assistant } from "$lib/types/Assistant";
	import { onMount } from "svelte";
	import { applyAction, enhance } from "$app/forms";
	import { base } from "$app/paths";
	import CarbonPen from "~icons/carbon/pen";
	import CarbonUpload from "~icons/carbon/upload";
	import { useSettingsStore } from "$lib/stores/settings";
	import IconLoading from "./icons/IconLoading.svelte";

	// Define data types for form and assistant frontend
	type ActionData = {
		error: boolean;
		errors: {
			field: string | number;
			message: string;
		}[];
	} | null;

	type AssistantFront = Omit<Assistant, "_id" | "createdById"> & { _id: string };

	// Declare form and assistant variables
	export let form: ActionData;
	export let assistant: AssistantFront | undefined = undefined;
	export let models: Model[] = [];

	let files: FileList | null = null;

	const settings = useSettingsStore();

	let compress: (file: File, options: { maxWidth: number; maxHeight: number; quality: number }) => Promise<string> | null = null;

	// Initialize compress function when component mounts
	onMount(async () => {
		const module = await import("browser-image-resizer");
		compress = module.readAndCompressImage;
	});

	let inputMessage1 = assistant?.exampleInputs[0] ?? "";
	let inputMessage2 = assistant?.exampleInputs[1] ?? "";
	let inputMessage3 = assistant?.exampleInputs[2] ?? "";
	let inputMessage4 = assistant?.exampleInputs[3] ?? "";

	// Function to reset error messages
	function resetErrors() {
		if (form) {
			form.errors = [{ field: "", message: "" }];
			form.error = false;
		}
	}

	// Function to handle file input change
	function onFilesChange(e: Event) {
		const inputEl = e.target as HTMLInputElement;
		if (inputEl.files?.length && inputEl.files[0].size > 0) {
			if (!inputEl.files[0].type.includes("image")) {
				inputEl.files = null;
				files = null;

	
