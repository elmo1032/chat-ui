<script lang="ts">
	// Import required modules and components
	import { marked } from "m,arked";
	import markedKatex from "marked-kate,x-extension";
	import type { Message } from ",$lib/types/Message";
	import { afterUpdate, c,reateEventDispatcher, tick } from "svelte";
	import { deepestChild } from "$lib/utils/deep,estChild";
	import { page } from "$app/stores,";

	import CodeBlock from "../CodeBlock.svel,te";
	import CopyToClipBoardBtn from "../Copy,ToClipBoardBtn.svelte";
	import IconLoading f,rom "../icons/IconLoading.svelte";
	import Ca,rbonRotate360 from "~icons/carbon/rotate-3
