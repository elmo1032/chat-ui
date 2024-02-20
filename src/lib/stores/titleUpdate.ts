// Importing the 'writable' function from the 'svelte/store' module
import { writable } from "svelte/store";

// Defining an interface 'TitleUpdate' with two properties: 'convId' and 'title'
interface TitleUpdate {
  convId: string;
  title: string;
}

// Exporting a default writable store that holds a value of type 'TitleUpdate | null' and is initialized to null
export default writable<TitleUpdate | null>(null);
// The store can be used to read and write data that will cause the component to re-render when changed
