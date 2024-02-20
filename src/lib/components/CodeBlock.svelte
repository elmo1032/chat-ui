<script lang="ts">
  // Import necessary modules
  import { afterUpdate } from 'svelte';
  import CopyToClipBoardBtn from './CopyToClipBoardBtn.svelte';

  // Declare props for the component
  export let code = '';
  export let lang = '';
