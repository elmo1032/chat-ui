// Import the models object from the server models module
import { models } from "$lib/server/models";

// Define an async function named GET that returns a Response object
export async function GET() {
  // Declare a constant variable named res and assign the result of mapping
  // over the models array and transforming each model object into a new
  // object with only the desired properties
  const res = models.map((model) => ({
    // The id property is assigned the value of the model's id property
    id: model.id,
    // The name property is assigned the value of the model's name property
    name: model.name,
    // The websiteUrl property is assigned the value of the model's websiteUrl property
    websiteUrl: model.websiteUrl,
    // The modelUrl property is assigned the value of the model's modelUrl property
    modelUrl: model.modelUrl,
    // The datasetName property is assigned the value of the model's datasetName property
    datasetName: model.datasetName,
    // The datasetUrl property is assigned the value of the model's datasetUrl property
    datasetUrl: model.datasetUrl,
    // The displayName property is assigned the value of the model's displayName property
    displayName: model.displayName,
    // The description property is assigned the value of the model's description property
    description: model.description,
    // The promptExamples property is assigned the value of the model's promptExamples property
    promptExamples: model.promptExamples,
    // The preprompt property is assigned the value of the model's preprompt property
    preprompt: model.preprompt,
    // The multimodal property is assigned the value of the model's multimodal property
    multimodal: model.multimodal,
    // The unlisted property is assigned the value of the model's unlisted property
    unlisted: model.unlisted,
  }));

  // Return a Response object with the JSON representation of the res array
  return Response.json(res);
}
