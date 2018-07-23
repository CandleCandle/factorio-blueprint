"use strict";

/* Current problems:
 *
 *
 * * Grid Modes *
 * When there is a rail, train stop (or rail signal?) then the json-to-object
 * conversion is:
 * $position-($size/2)
 * This is the half-odd mode. (odd dimensions have coordinates that are not integral)
 * e.g.
 * {
 *   "name": "straight-rail",
 *   "position": {
 *     "x": -8,
 *     "y": 6
 *   }
 * }
 * width = 2; height = 2.
 * --> top corner is (-9, 5)
 *
 * When there are no rails then the json-to-object conversion is:
 * $position+0.5-($size/2)
 * This is the half-even mode. (odd dimensions have coordinates that are integral)
 *
 *
 * * Signals *
 * the circuit system not the train system.
 * Currently a random object with two fields - name and type.
 * I have yet to see a case where there isn't a 1:1 mapping between name and type;
 * i.e. when name is 'stone', type is always 'item'
 * 
 * -- ANSWER: Therefore I propose a Signal class that knows about this mapping, and just
 * renders the type based on the name.
 *
 *
 *
 * * tileDataAction *
 * tileDataAction needs to know about: position, size and direction.
 * Option 1: use if (typeof this.{function} === 'function') to detect that the resulting class is mixed with the appropriate other mixin.
 *    - can lead to complicated code;
 *    - can lead to hidden depependencies between mixins; and therefore a hidden ordering
 *    - a work-around might be to define the dependencies in code and warn/enforce them when creating classes.
 *
 * Option 2: have all of position+size+direction in the same mixin
 *    - leads to one-big-class, which is the problem that mixins are trying to solve.
 *
 * Option 3: Keep them separate and define another mixin that depends on the others being there.
 *    - arbitrary mixins that don't really relate to a feature
 *
 * 
 * Current dependency tree:
 * size depends-on direction
 * position depends-on size
 * tileDataAction depends-on position
 * tileDataAction depends-on size
 *
 * -- ANSWER: None yet.
 *
 *
 * * Item Types stored using underscore based names *
 * The raw blueprint JSON representation stores item type names using hyphens
 * to separate words; e.g. filter-stack-inserter, or speed-module-3.
 *
 * Option 1: backwards compatibility
 * Convert all - to _ on reading, use _ throughout the code. convert to - on
 * output.
 * Leads to complicated code in many places, dealing with the conversion; particularly
 * when items are object field names.
 *
 * Option 2: keep using - and break backwards compatibility
 * Use - throughout the code. defaultentities.js would have to change; and can
 * if the entries become strings and are quoted like:
 * `'assembling-machine-3': { modules: 4 }`
 *
 * -- ANSWER: refactor to use hyphens for all entity types.
 *
 *
 * * Field access on the Entity class *
 * The original Entity class exposes multiple fields to users; for example the
 * 'modules' field. When this is modified to add/remove modules, it bypasses any
 * encapsulation that the Entity class offers; Sample code might:
 * const e = blueprint.createEntity(...);
 * e.modules.speed_module_3 = 3;
 *
 * This bypasses any checks that might happen on the maximum allowed modules,
 * leading to having to check the module count at toObject time, moving the error
 * from the place it actually occurs to effectivly a random place.
 *
 * This also means that we cannot store the type of modules using the in-game
 * names (hyphens and not underscores)
 *
 * from the documentation:
 * Do not modify properties directly! Functions to set things such as direction or position are included because they do more than just set the variable.
 *
 * I think this statement allows me to change the internal behaviour and mutate
 * using 'get' methods in the compatibility layer.
 *
 * -- ANSWER: Modules API needed a proper API anyway, breaking this is acceptable.
 *
 */


/*
 * Base Entity, should contain the bare minimum that is in every entity.
 *
 * Subclasses should override toObject and fromObject; ensuring that they
 * call the appropriate super.toObject / super.fromObject.
 *
 * Basic properties should use the _property(...) function to wrap the
 * getter/setter behaviour.
 *
 * Properties should be prefixed with an underscore to indicate that they
 * are 'private'.
 *
 * Basic properties shound generally map to an element in the json; with
 * additional functions to provide a more friendly interface.
 */
class BaseEntity {
  // name
  // type (item, recipe, tile, virtual, fluid)

  name(name) {
    return this._property('_name', name);
  }

  number(number) {
    return this._property('_number', number);
  }

  toObject() {
    return {
      name: this.name().replace(/_/g, '-'),
      entity_number: this.number()
    };
  }

  fromObject(entityObject) {
    this.name(entityObject.name);
    this.number(entityObject.entity_number);
  }

  /**
   * utility function to wrap the simple getter&builder behaviour
   * note that use of this function is optional, but the getter/setter
   * behaviour should be maintained
   * @param {type} name name of the property to get/set
   * @param {type} value if presant, causes the function to set the property and return 'this' for method chaining, if missing, causes the function to return the current value of the property.
   * @return {BaseEntity}
   */
  _property(name, value) {
    if (typeof value === 'undefined') return this[name];
    this[name] = value;
    return this;
  }
}

/*
 * Mixins implement a bit of entity functionality.
 * The implementations are in the 'entitymixins' package.
 *
 * each has:
 * * toObject that merges it's bit of functionality into the final result
 * * fromObject that extracts the bits it needs from a freshly parsed blueprint
 * * various builder/getter-style methods that: when supplied with 0 arguments
 *     returns that value; when supplied with arguments sets the property
 *     and returns this
 *
 */

module.exports = {
  BaseEntity: BaseEntity,
  RoboPort: require('./entitymixins/roboport'),
  MiningDrill: require('./entitymixins/miningdrill'),
  TrainStop: require('./entitymixins/trainstop'),
  Filter: require('./entitymixins/filter'),
  LogisticFilter: require('./entitymixins/logisticfilter'),
  Direction: require('./entitymixins/direction'),
  DirectionType: require('./entitymixins/directiontype'),
  Position: require('./entitymixins/position'),
  Inventory: require('./entitymixins/inventory'),
  CircuitControl: require('./entitymixins/circuitcontrol'),
  Modules: require('./entitymixins/modules'),
  Recipe: require('./entitymixins/recipe'),
  Connections: require('./entitymixins/connections'),
  ArithmeticCombinator: require('./entitymixins/arithmeticcombiner'),
  DeciderCombinator: require('./entitymixins/decidercombiner'),
  ConstantCombinator: require('./entitymixins/constantcombiner')
};

// vi: sts=2 ts=2 sw=2 et