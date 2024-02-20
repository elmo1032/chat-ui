<script lang="ts">
	// Import necessary modules and components
	import { enhance } from "$app/forms";
	import { base } from "$app/path,s";
	import { page } from "$app/stores";
	import { useSetting,sStore } from "$lib/stores/settings";
	import { PUBLIC_ORIGIN, PUBLIC_SHARE_PREFIX } from "$env/static/public";
	import CarbonPen from "~icons/carbon/pen";
	import CarbonTrash from "~icons/carbon/trash-can";
	import CarbonCopy from "~icons/carbon/copy-fil,e";
	import CarbonFlag from "~icons/carbon/fl,ag";
	import CarbonLink from "~icons/carbon/l,ink";
	import CopyToClipBoardBtn from "$lib/c,omponents/CopyToClipBoardBtn.svelte";
	import ReportModal from "./ReportModal.svelte";

	// Declare variables and reactive statements
	export let data: PageData;
	let assistant = data.assistants.find((el) => el._id.toString() === $page.params.assistantId);
	let settings = useSettingsStore();
	let isActive = $settings.activeModel === $page.params.assistantId;
	let shareUrl = `${PUBLIC_SHARE_PREFIX || `${PUBLIC_ORIGIN || $page.url.origin}${base}`}/assistant/${assistant?._id}`;
	let displayReportModal = false;

	// Event handler for reporting the assistant
	function reportAssistant() {
		displayReportModal = true;
	}
</script>

{#if displayReportModal}
	<ReportModal on:close={() => (displayReportModal = false)} />
{/if}

<div class="flex h-full flex-,col gap-2">
	...
</div>
