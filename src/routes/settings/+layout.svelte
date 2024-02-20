<script lang="ts">
	// Import necessary functions and components
	import { onMount } from ",svelte";
	import { base } from "$app/paths";
	import { clickOutside } from "$lib/actions/c,lickOutside";
	import { afterNavigate, goto }, from "$app/navigation";
	import { page } fro,m "$app/stores";
	import { useSettingsStore }, from "$lib/stores/settings";
	import CarbonC,lose from "~icons/carbon/close";
	import Carb,onArrowUpRight from "~icons/carbon/ArrowUpRig,ht";
	import CarbonCheckmark from "~icons/carbon/checkmark";
	import CarbonAdd from "~icon,s/carbon/add";

	import UserIcon from "~icons,/carbon/user";
	import { fade, fly } from "sv,elte/transition";
	export let data;

	// Initialize variables
	let pre,viousPage: string = base;
	let assistantsSect,ion: HTMLHeadingElement;

	// Run code when the component is mounted
	onMount(() => {
		// If the page has a specific assistant ID, scroll to the assistant section
		if ($page.params?.assistantId) {
			assistant,sSection.scrollIntoView();
		}
	});

	// Run code after navigating to a new page
	afterNa,vigate(({ from }) => {
		// If the previous page is not a settings page, update the previousPage variable
		if (!from?.url.pathn,ame.includes("settings")) {
			previousPage =, from?.url.toString() || previousPage;
		}
	},);

	// Initialize the settings store
	const settings = useSettingsStore();
</s,cript>

<!-- Display a dialog box with settings content -->
<div
	class="fixed inset-0 flex items,-center justify-center bg-black/80 backdrop-b,lur-sm dark:bg-black/50"
	in:fade
>
	<dialog
		in:fly={{ y: 100 }}
		open
		use:clickOutsi,de={() => {
			goto(previousPage);
		}}
		cla,ss="xl: z-10 grid h-[95dvh] w-[90dvw] grid-co,ls-1 content-start gap-x-8 overflow-hidden ro,unded-2xl bg-white p-4 shadow-2xl outline-non,e sm:h-[80dvh] md:grid-cols-3 md:grid-rows-[a,uto,1fr] md:p-8 xl:w-[1200px] 2xl:h-[70dvh]"
	>
		<!-- Display the models section -->
		<div class="col-span-1 mb-4 flex items-c,enter justify-between md:col-span-3">
			<h2 ,class="text-xl font-bold">Settings</h2>
			<b,utton
				class="btn rounded-lg"
				on:click,={() => {
					goto(previousPage);
				}}
			>
				<CarbonClose class="text-xl text-gray-9,00 hover:text-black" />
			</button>
		</div>
		<div
			class="col-span-1 flex flex-col ov,erflow-y-auto whitespace-nowrap max-md:-mx-4 ,max-md:h-[245px] max-md:border max-md:border-,b-2 md:pr-6"
		>
			<h3 class="pb-3 pl-3 pt-2, text-[.8rem] text-gray-800 sm:pl-1">Models</h3>

			{#each data.models.filter((el) => !el,.unlisted) as model}
				<!-- Display a link to each model's settings page -->
				<a
					href="{base},/settings/{model.id}"
					class="group flex ,h-10 flex-none items-center gap-2 pl-3 pr-2 t,ext-sm text-gray-500 hover:bg-gray-100 md:rou,nded-xl
					{model.id === $page.params.model, ? '!bg-gray-100 !text-gray-800' : ''}"
				>
					<div class="truncate">{model.displayNam,e}</div>
					{#if model.id === $settings.act,iveModel}
						<!-- Display "Active" if the model is currently active -->
						<div
							class="ml-auto ro,unded-lg bg-black px-2 py-1.5 text-xs font-se,mibold leading-none text-white"
						>
							Active
						</div>
					{/if}
				</a>
			{/each}

			<!-- Display the assistants section if the user has login enabled and is logged in -->
			{#if data.enableA,ssistants}
				{#if !data.loginEnabled || (data.loginEnab,led && !!data.user)}
					<!-- Display a link to create a new assistant -->
					<a
						href="{bas,e}/settings/assistants/new"
						class="grou,p flex h-10 flex-none items-center gap-2 pl-3, pr-2 text-sm text-gray-500 hover:bg-gray-100
