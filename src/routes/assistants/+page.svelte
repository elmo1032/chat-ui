<script lang="ts">
	// Import necessary types and modules
	import type { PageData } from "./$types";
	import { PUBLIC_APP_ASSETS, PUBLIC_ORIGIN } from "$env/static/public";
	import { isHuggingChat } from "$lib/utils/isHuggingChat";
	import { goto, base, page } from "$app/navigation";
	import { formatUserCount } from "$lib/utils/formatUserCount";
	import { getHref } from "$lib/utils/getHref";

	// Import icons from `~icons`
	import CarbonAdd from "~icons/carbon/add";
	import CarbonHelpFilled from "~icons/carbon/help-filled";
	import CarbonClose from "~icons/carbon/close";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";
	import CarbonEarthAmerica from "~icons/carbon/earth-america";
	import CarbonUserMultiple from "~icons/carbon/user-multiple";

	// Import Pagination component
	import Pagination from "$lib/components/Pagination.svelte";

	// Define the exported `data` prop
	export let data: PageData;

	// Define reactive properties
	$: assistantsCreator = $page.url.searchParams.get("user");
	$: createdByMe = data.user?.username && data.user.username === assistantsCreator;

	// Define the `onModelChange` function
	const onModelChange = (e: Event) => {
		const newUrl = getHref($page.url, {
			newKeys: { modelId: (e.target as HTMLSelectElement).value },
			existingKeys: { behaviour: "delete_except", keys: ["user"] },
		});
		goto(newUrl);
	};
</script>

<svelte:head>
	{#if isHuggingChat}
		<title>HuggingChat - Assistants</title>
		<meta property="og:title" content="HuggingChat - Assistants" />
		<meta property="og:type" content="link" />
		<meta property="og:description" content="Browse HuggingChat assistants made by the community." />
		<meta property="og:image" content="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/assistants-thumbnail.png" />
		<meta property="og:url" content={$page.url.href} />
	{/if}
</svelte:head>

<div class="scrollbar-custom mr-1 h-full overflow-y-auto py-12 md:py-24">
	<div class="pt-42 mx-auto flex flex-col px-5 xl:w-[60rem] 2xl:w-[64rem]">
		<div class="flex items-center">
			<h1 class="text-2xl font-bold">Assistants</h1>
			{#if isHuggingChat}
				<div class="ml-1.5 rounded-lg text-xxs uppercase text-gray-500 dark:text-gray-500">
					beta
				</div>
				<a href="https://huggingface.co/spaces/huggingchat/chat-ui/discussion/357" class="ml-auto dark:text-gray-400 dark:hover:text-gray-300" target="_blank">
					<CarbonHelpFilled />
				</a>
			{/if}
		</div>
		<h3 class="text-gray-500">Popular assistants made by the community</h3>
		<div class="mt-6 flex justify-between gap-2 max-sm:flex-col sm:items-center">
			<select
				class="mt-1 h-[34px] rounded-lg border border-gray-300 bg-gray-50 px-2 text-sm text-gray-900 focus:border-blue-700 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
				bind:value={data.selectedModel}
				on:change={onModelChange}
			>
				<option value="">All models</option>
				{#each data.models.filter((model) => !model.unlisted) as model}
					<option value={model.name}>{model.name}</option>
				{/each}
			</select>

			<a href="{base}/settings/assistants/new" class="flex items-center gap-1 whitespace-nowrap rounded-lg border bg-white py-1 pl-1.5 pr-2.5 shadow-sm hover:bg-gray-50 hover:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700">
				<CarbonAdd />Create New assistant
			</a>
		</div>

		<div class="mt-7 flex items-center gap-x-2 text-sm">
			{#if assistantsCreator && !createdByMe}
				<div class="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
					{assistantsCreator}'s Assistants
					<a href="#" class="group">
						<CarbonClose class="text-xs group-
