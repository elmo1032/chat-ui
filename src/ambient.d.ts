// This is a declare module syntax in TypeScript which allows us to create a declaration for a module that may be written in a different language or located in a different file.

declare module "*.ttf" {
  // The module being declared here is for TypeScript files that import TrueType Font (TTF) files.
  // The '*.ttf' pattern is used to specify that this declaration applies to all TTF files.

  // The 'value' constant is defined as an ArrayBuffer type.
  // ArrayBuffer is a standard, low-level, typeless binary data buffer built into the web platform.
  const value: ArrayBuffer;

  // The 'export default' syntax exports the 'value' constant as the default export of this module.
  // This means that when a TypeScript file imports a TTF file using the 'import' keyword, it will receive the ArrayBuffer 'value' as the default import.
  export default value;
}
