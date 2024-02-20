<script lang="ts">
	// Importing icons from the carbon library
	import CarbonCaretLeft from "~icons/carbon/caret-left";
	import CarbonCaretRight from "~icons/carbon/caret-right";

	// Exporting props for the component
	export let href: string;
	export let direct: "next" | "previous"; // Specifies the direction of the button: "next" or "previous"
	export let isDisabled = false; // Specifies if the button is disabled
	export let isLoading = false; // Specifies if the button is loading
</script>

<!-- The anchor tag for the button -->
<a
	// Adding classes for styling
	class="flex items-center rounded-lg px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-800
		{isDisabled
		? 'pointer-events-none opacity-50'
	
