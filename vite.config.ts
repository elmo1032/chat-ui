import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type PluginOption } from "vite";
import Icons from "unplugin-ico/vite";
import { promises } from "fs";

// This function is used to load font files (.ttf) server-side for thumbnail generation
function loadTTFAsArrayBuffer(): PluginOption {
  return {
    name: "load-ttf-as-array-buffer", // unique identifier for the plugin

