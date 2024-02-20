<script lang="ts">
	// Import necessary types and components
	import type { Message } from "$lib/types/Message";
	import {
		createEve,
		ntDispatcher,
		onDestroy,
		tick
	} from "svelte";

	import CarbonSendAltFilled from "~icons/c,arbon/send-alt-filled";
	import CarbonExport ,from "~icons/carbon/export";
	import CarbonSt,opFilledAlt from "~icons/carbon/stop-filled-a,lt";
	import CarbonClose from "~icons/carbon/,close";
	import CarbonCheckmark from "~icons/,carbon/checkmark";
	import CarbonCaretDown fr,om "~icons/carbon/caret-down";

	import EosIc,onsLoading from "~icons/eos-icons/loading";

	// Import custom components
	import ChatInput from "./ChatInput.svelte";
	import StopGeneratingBtn from "../StopGenera,tingBtn.svelte";
	import type { Model } from ,"$lib/types/Model";
	import WebSearchToggle f,rom "../WebSearchToggle.svelte";
	import Logi,nModal from "../LoginModal.svelte";
	import {, page } from "$app/stores";
	import FileDropzone,one from "./FileDropzone.svelte";
	import Ret,ryBtn from "../RetryBtn.svelte";
	import Uplo,adBtn from "../UploadBtn.svelte";
	import fil,e2base64 from "$lib/utils/file2base64";
	impo,rt type { Assistant } from "$lib/types/Assist,ant";
	import { base } from "$app/paths";
	im,port ContinueBtn from "../ContinueBtn.svelte",;
	import AssistantIntroduction from "./Assis,tantIntroduction.svelte";
	import ChatMessage, from "./ChatMessage.svelte";
	import ScrollT,oBottomBtn from "../ScrollToBottomBtn.svelte",;
	import { browser } from "$app/environment",;
	import { snapScrollToBottom } from "$lib/a,ctions/snapScrollToBottom";
	import SystemPro,mptModal from "../SystemPromptModal.svelte";
	import ChatIntroduction from "./ChatIntroduc,tion.svelte";
	import { useConvTreeStore } fr,om "$lib/stores/convTree";

	// Define exported variables and reactive statements
	export let messa,ges: Message[] = [];
	export let loading = fa,lse;
	export let pending = false;

	export le,t shared = false;
	export let currentModel: M,odel;
	export let models: Model[];
	export le,t assistant: Assistant | undefined = undefine,d;
	export let preprompt: string | undefined ,= undefined;
	export let files: File[] = [];

	$: isReadOnly = !models.some((model) => model.id === currentModel.id);

	// Define local variables and event handlers
	let loginModalO,pen = false;
	let message: string;
	let timeo,ut: ReturnType<typeof setTimeout>;
	let isSha,redRecently = false;
	$: $page.params.id && (,isSharedRecently = false);

	const dispatch =, createEventDispatcher<{
		message: string;
	,	share: void;
		stop: void;
		retry: { id: Me,ssage["id"]; content?: string };
		continue: ,{ id: Message["id"] };
	}>();

	const handleS,ubmit = () => {
		if (loading) return;
		disp,atch("message", message);
		message = "";
	};,

	let lastTarget: EventTarget | null = null;,

	let onDrag = false;

	const onDragEnter = ,(e: DragEvent) => {
		lastTarget = e.target;
,		onDrag = true;
	};
	const onDragLeave = (e:, DragEvent) => {
		if (e.target === lastTarge,t) {
			onDrag = false;
		}
	};
	const onDrag,Over = (e: DragEvent) => {
		e.preventDefault,();
	};

	const convTreeStore = useConvTreeSt,ore();

	$: lastMessage = browser && (message,s.find((m) => m.id == $convTreeStore.leaf) as, Message);
	$: lastIsError = lastMessage && l,astMessage.from === "user" && !loading;

	$: ,sources = files.map((file) => file2base64(fil,e));

	function onShare() {
		dispatch("share,");
		isSharedRecently = true;
		if (timeout), {
			clearTimeout(timeout);
		}
		timeout = ,setTimeout(() => {
			isSharedRecently = fals,e;
		}, 2000);
	}

	onDestroy(() => {
		if (t,imeout) {
			clearTimeout(timeout);
		}
	});
,
	let chatContainer: HTMLElement;

	async fun,ction scrollToBottom() {
		await tick();
		ch,atContainer.scrollTop = chatContainer.scrollH,eight;
	}

	// If last message is from user, scroll to bottom
	$: if (lastMessage && lastM,essage.from === "user") {
		scrollToBottom();,
	}
</script>

<div class="relative min-h-0 m,in-w-0">
	{#if loginModalOpen}
		<LoginModal
,			on:close={() => {
				loginModalOpen = fal,se;
			}}
		/>
	{/if}
	<div
		class="scrollba,r-custom mr-1 h-full
