// Import the 'BackendModel' type from the '$lib/serve,r/models' module.
import type { BackendModel } from "$lib/serve,r/models";

// Define a new type called 'Model' which is a subset of the 'BackendModel' type.
// This subset includes the following properties:
// - 'id': a string representing the unique identifier of the model
// - 'name': a string representing the name of the model
// - 'displayName': a string representing the display name of the model
// - 'websiteUrl': a string representing the URL of the model's website
// - 'datasetName': a string representing the name of the dataset used by the model
// - 'promptExamples': an array of strings representing examples of prompts that can be used with the model
// - 'parameters': an object containing information about the model's parameters
// - 'description': a string representing a brief description of the model
// - 'modelUrl': a string representing the URL of the model
// - 'datasetUrl': a string representing the URL of the dataset used by the model
// - 'preprompt': a string representing a pre-prompt that can be used with the model
// - 'multimodal': a boolean indicating whether the model is multimodal or not
// - 'unlisted': a boolean indicating whether the model is listed or not
export type Model = Pick<
	BackendModel,
	| "id"
	| "name"
	| "displayName"
	| "websiteUrl"
	| "datasetName"
	| "promptExamples"
	| "parameters"
	| "description"
	| "modelUrl"
	| "datasetUrl"
	| "preprompt"
	| "multimodal"
	| "unlisted"
>;
