<script lang="ts">
	// This script exports a variable 'classNames' which is a comma-separated string
	export let classNames = ",";
</script>

<svg
	// The svg element sets the xmlns attribute to define the version of SVG language being used
	xmlns="http://www.w3.org/2000/svg"
	// The 'class' attribute is set to the exported 'classNames' variable
	class={classNames}
	// The 'width' and 'height' attributes are set to 1em
	width="1em"
	height="1em"
	// The 'fill' attribute is set to 'none'
	fill="none"
	// The 'viewBox' attribute defines the visible portion of the SVG canvas
	viewBox="0 0 32 32"
	// The svg element contains a path element
	><path
		// The 'fill' attribute is set to 'currentColor'
		fill="currentColor"
		// The 'fill-rule' attribute is set to 'evenodd'
		fill-rule="evenodd"
		// The 'd' attribute defines the shape of the path using a series of moveto, lineto, and curveto commands
		d="M3.143 20.286h4.286v2.142H3.143A2.143 2.143 0 0 1 1 20.287V3.143A2.143 2.143 0 0 1 3.143 1h17.143a2.143 2.143 0 0 1 2.142 2.143v4.286h-2.142V3.143H3.143v17.143Zm9.643-,12.857v3.214H16v2.143h-3.214
