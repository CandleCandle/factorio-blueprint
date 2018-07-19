

Entity Code Structure
=====================

Entity classes are constructed from several mixins; each describing a small
set of functionality.

The functions on each mixin can be divided into various groups:

Translation functions; `fromObject` and `toObject`:
The core translation functions, translating from a parsed blueprint string to javascript objects and the reverse.
These functions should generally not be called by client code directly, prefer going via a Blueprint or Blueprint Book object.

Property getter/setters:
Primarally used by the fromObject and toObject to assign the correct data from the parsed blueprint string, most can be called by client code, but can take complicated data structures as parameters that, in turn, can be harder to get right.

Property utility functions:
Used to abstract arbitrary constants from client code; for example, the roboport circuit mode has a value of 0 or 1; with one option being 'read robot statistics' and the other being 'read logistics network'.
Used to abstract complicated object structure from client code: for example, the modules in an assembler or circuit conditions in a decider combinator.


Data properties on entities are prefixed with an underscore, indicating that they should not be modified directly. If you find client code requires modifying one of these properties, then raise an issue or pull request against this library.


Tests
=====

Some end-to-end tests can be found in `blueprint_(parse|generate)_tests.js` Try to keep the example blueprint as minimal as possible to demonstrate the feature or bug.

Each entity mixin has it's own set of tests to check the behaviour of each feature set.


Common Mistakes
===============

Given that property getter/setters and their properties differ by an underscore, it is easy to overwrite the function with the property value:
```javascript
circuitModeOfOperation(circuitModeOfOperation) {
  return this._property('circuitModeOfOperation', circuitModeOfOperation);
}
```
The error message that is generated when you attempt to call `circuitModeOfOperation` is:
`TypeError: this.circuitModeOfOperation is not a function`
The error is in the first parameter to the `_property(..)` function, it should be:
```javascript
  return this._property('_circuitModeOfOperation', circuitModeOfOperation);
```