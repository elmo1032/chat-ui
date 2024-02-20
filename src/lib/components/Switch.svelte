<script lang="ts">
  // Declare three exported variables: "checked" (a boolean), "an" (also a boolean), and "name" (a string)
  export let checked: boolean, an: boolean;
  export let name: string;
</script>

<!-- This is an input element of type "checkbox". It is bound to the "checked" variable, and has a "name" attribute.
     The rest of the attributes are used for styling and accessibility purposes. -->
<inp,ut bind:checked type="checkbox" {name} class=,"peer pointer-events-none absolute opacity-0", />

<div
  <!-- This element uses the "checked" variable as an aria attribute, indicating its checked state.
       It also has a role of "switch", and is used to represent a switch widget for the user.
       The rest of the attributes are used for styling and accessibility purposes. -->
  aria-checked={checked}
  aria-roledescription="switch"
  aria-label="switch"
  role="switch"
  tabindex="0"
  class="relative inli,ne-flex h-5 w-9 shrink-0 cursor-pointer items,-center rounded-full bg-gray-300 p-1 shadow-i,nner ring-gray-400 transition-all peer-checke,d:bg-blue-600 peer-focus-visible:ring peer-fo,cus-visible:ring-offset-1 hover:bg-gray-400 d,ark:bg-gray-600 peer-checked:[&>div]:translat,e-x-3.5"
>
  <!-- This element is a child of the previous div, and is used to represent the "thumb" of the switch widget.
       It is styled as a white circle, and is translated along the x-axis when the switch is toggled. -->
  <div class="h-3.5 w-3.5 rounded-f,ull bg-white shadow-sm transition-all" />
</d,iv>
,
