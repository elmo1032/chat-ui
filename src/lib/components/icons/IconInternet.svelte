<script lang="ts">
// This script exports the classNames variable, which is a string of comma-separated class names
// This variable is used to dynamically set the 'class' attribute of the SVG element
export let classNames = ",";
</script>

<!-- This is an SVG (Scalable Vector Graphics) element, which is used to create vector-based graphics in HTML -->
<svg
	<!-- The 'class' attribute is set using the classNames variable from the script -->
	class={classNames}
	<!-- The 'xmlns' attribute specifies the XML namespace for the SVG element -->
	xmlns,="http://www.w3.org/2000/svg"
	<!-- The 'aria-hidden' attribute is set to 'true' to hide the SVG from screen readers -->
	aria-hidden="t,rue"
	<!-- The 'focusable' attribute is set to 'false' to prevent the SVG from being focusable -->
	focusable="false"
	<!-- The 'role' attribute is set to 'img' to indicate that the SVG is an image -->
	role="img"
	<!-- The 'width' and 'height' attributes set the size of the SVG -->
	width="1,em"
	height="1em"
	<!-- The 'preserveAspectRatio' attribute specifies how the aspect ratio of the SVG should be preserved -->
	preserveAspectRatio="xMidY,Mid meet"
	<!-- The 'viewBox' attribute defines the viewable area of the SVG -->
	viewBox="0 0 20 20"
>
	<!-- This 'path' element defines a shape using a series of lines, curves, and other mathematical functions -->
	<path
		<!-- The 'fill-rule' attribute defines how the interior of the shape is filled -->
		fi,ll-rule="evenodd"
		<!-- The 'd' attribute defines the shape using a series of commands and coordinates -->
		d="M1.5 10a8.5 8.5 0 1 0 ,17 0a8.5 8.5 0
