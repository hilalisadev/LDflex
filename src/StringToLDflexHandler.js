/**
 * Yields a function that interprets a string expression as an LDflex path.
 */
export default class StringToLDflexHandler {
  execute(path, proxy) {
    // Resolves the given string expression against the LDflex object
    return (expression = '', ldflex = proxy) => {
      // An expression starts with a property access in dot or bracket notation
      const propertyPath = expression
        // Add the starting dot if omitted
        .replace(/^(?=[a-z$_])/i, '.')
        // Add quotes inside of brackets if omitted
        .replace(/\[([^'"`\](]*)\]/g, '["$1"]');

      // Create a function to evaluate the expression
      const body = `"use strict";return ldflex${propertyPath}`;
      let evaluator;
      try {
        /* eslint no-new-func: off */
        evaluator = Function('ldflex', body);
      }
      catch ({ message }) {
        throw new Error(`Expression "${expression}" is invalid: ${message}`);
      }

      // Evaluate the function
      return evaluator(ldflex);
    };
  }
}