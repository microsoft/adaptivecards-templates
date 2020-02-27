"use strict";

// This mock fixes the issue
// "Cannot find module 'monaco-editor' from 'Designer.tsx'"
// The module exists but jest does not recognise it
const editor = {
  create: () => {
    return {
      dispose: () => {}
    };
  }
};

const monaco = {
  editor
};

module.exports = monaco;
