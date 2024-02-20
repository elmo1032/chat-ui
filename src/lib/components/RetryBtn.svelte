<script lang="ts">
	// Importing the CarbonRotate360 icon from the carbon library
	import CarbonRotate360 from '~icons/carbon/rotate-360';

	// Declaring and initializing the variables `c` and `classNames`
	export let c, classNames = "";
</script>

<!-- Defining a button element with various attributes and classes -->
<button
	type="button"		<!-- Specifies the type of the button -->
	on:click		<!-- Defines the click event handler for the button -->
	class="btn flex h-8 rounded-lg border bg-white px-3 py-1 text-gray-500 shadow-sm transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 {classNames}"
>
	<!-- Adding the CarbonRotate360 icon and the text "Retry" to the button -->
	<CarbonRotate360 class="mr-2 text-xs " /> Retry
</button>
