<!-- This script is written in TypeScript (.ts) and exports several variables. -->
<script lang="ts">
  // The component accepts a name and description prop.
  export let name: string;
  export let description: string = "";
  
  // The component also accepts an optional createdByName prop and a possibly undefined avatar prop.
  export let createdByName: string | undefined;
  export let avatar: string | undefined;

  // The script imports a logo as a raw SVG.
  import logo from "../static/huggingchat/logo.svg?raw";
</script>

<!-- The component's template is a flex container with a black background and centered text. -->
<div class="flex h-full w-full flex-col items-center justify-center bg-black p-2">
  <div
    class="flex w-full max-w-[540px] items-start justify-center text-white"
  >
    <!-- If avatar is defined, display it as an image. -->
    {#if avatar}
      <img
        class="h-64 w-64 rounded-full"
        style="object-fit: cover;"
        src={avatar}
        alt="avatar"
      />
    {/if}
    <!-- Display the logo, name, and description. -->
    <div class="ml-10 flex flex-col items-start">
      <p class="mb-2 mt-0 text-3xl font-normal text-gray-400">
        <span class="mr-1.5 h-8 w-8">
          <!-- eslint-disable-next-line -->
          <span class="ht-ml logo" inline-html>{logo}</span>
        </span>
        AI assistant
      </p>
      <h1
        class={`m-0 ${
          name.length < 38 ? "text-5xl" : "text-4xl"
        } font-black`}
      >
        {name}
      </h1>
      <p class="mb-8 text-2xl">
        {description.slice(0, 160)}
