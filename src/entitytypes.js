"use strict";

/* Current problems:
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

  // extended functionality
  Accumulator: require('./entitymixins/accumulator'),
  Alarm: require('./entitymixins/alarm'),
  ArithmeticCombinator: require('./entitymixins/arithmeticcombiner'),
  CircuitControl: require('./entitymixins/circuitcontrol').CircuitControl,
  Connections: require('./entitymixins/connections'),
  ConstantCombinator: require('./entitymixins/constantcombiner'),
  CurvedRail: require('./entitymixins/curvedrail'),
  DeciderCombinator: require('./entitymixins/decidercombiner'),
  Direction: require('./entitymixins/direction'),
  DirectionType: require('./entitymixins/directiontype'),
  Filter: require('./entitymixins/filter'),
  Inventory: require('./entitymixins/inventory'),
  LogisticFilter: require('./entitymixins/logisticfilter'),
  MiningDrill: require('./entitymixins/miningdrill'),
  Modules: require('./entitymixins/modules'),
  Position: require('./entitymixins/position'),
  Recipe: require('./entitymixins/recipe'),
  RoboPort: require('./entitymixins/roboport'),
  StraightRail: require('./entitymixins/straightrail'),
  TrainStop: require('./entitymixins/trainstop')
};

// vi: sts=2 ts=2 sw=2 et