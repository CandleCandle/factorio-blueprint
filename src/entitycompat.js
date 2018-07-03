

const entitytypes = require('./entitytypes');
const mixwith = require('mixwith');

function nameToKey(name) {
  return name.replace(/-/g, '_');
}

/**
 * Compatibility interface between the old entity class and new.
 */

module.exports = function (entityData) {
  const typeCache = {};

  /**
   * get a class for the provided entity type name.
   * @param {type} name entity type
   * @return {class}
   */
  function getType(name) {
    if (!typeCache[name])
      typeCache[name] = createType(name);
    return typeCache[name];
  }

  /**
   * Creates a class for the entity type given the name.
   * @param {type} name
   * @return {class}
   */
  // TODO convert this to a static function in Entity so that it can be tested externally.
  function createType(name) {
//        console.log(entityData);
    const staticEntityData = entityData[nameToKey(name)];
    console.log("static data for: ", name, nameToKey(name), staticEntityData);

    // least specific to the most specific; thus any specific implementation
    // can override the generic implementation.
    // the following guess-work could be pushed into the entitydata as an
    // element on the object. That way the functionality is defined in input
    // data and not in some arbitrary rule set.
    features = [];

    if (staticEntityData.type === 'item') {
      features.push(entitytypes.Direction);
      features.push(entitytypes.Position);
      features.push(entitytypes.Connections); // XXX Not every entity can actually accept connections, but most can, so until we can define this on a type-by-type basis, enable it for everything.
      features.push(entitytypes.CircuitControl); // XXX Not every entity has circuit control, but enough can, and there's no defining feature to them that I can identify, so until we can define it in the defaultentities, enable it by default.
    }
    if (name.match(/filter[-_]inserter/)) {
      features.push(entitytypes.Filter);
    }
    if (staticEntityData.inventorySize) {
      features.push(entitytypes.Inventory);
      features.push(entitytypes.LogisticFilter); // XXX assume entities that have an inventory can also have logistic filters.
    }
    if (staticEntityData.modules) {
      features.push(entitytypes.Modules);
    }
    if (name.includes('assembling')) {
      features.push(entitytypes.Recipe);
    }
    if (name.match(/decider[-_]combinator/)) {
      features.push(entitytypes.DeciderCombinator);
    }
    if (name.match(/arithmetic[-_]combinator/)) {
      features.push(entitytypes.ArithmeticCombinator);
    }

    console.log("using features: ", features);
    return mixwith.mix(entitytypes.BaseEntity).with(...features);
  }

  class Entity {
    constructor(data, _positionGrid, _bp, center) {
      this.wrapped = new (getType(data.name))();
      const mergedEntityData = {...entityData[nameToKey(data.name)], ...data};
      console.log("merged entity data: ", mergedEntityData);
      this.wrapped.fromObject(mergedEntityData);
      console.log("final wrapped: ", this.wrapped);
    }

    checkNoOverlap(positionGrid) {
      const ent = this.getOverlap(positionGrid);
      return !ent;
    }

    getOverlap(positionGrid) {
      let item = null;
      this.wrapped.tileDataAction((x, y) => {
        item = positionGrid[x + ',' + y] || item;
      });
      return item;
    }

    /**
     * Sort out the inter-entity connections
     * @param {type} entityPositionGrid "x,y" indexed table mapping positions to entities
     * @param {type} entities list of all entities; All entities MUST have a number.
     */
    place(entityPositionGrid, entities) {
      entities.forEach(e => { // e in this case is an entitycompat.
        e.tileDataAction({}, (x, y) => entityPositionGrid[x+','+y] = e );
      });
      this.updateConnections(entities);
    }

    /**
     * Sort out the inter-entity connections
     * @param {type} entityPositionGrid "x,y" indexed table mapping positions to entities
     * @param {type} entities list of all entities
     */
    updateConnections(entities) {
      if (typeof this.wrapped.updateConnections === 'function') {
        const numberMap = {};
        entities.forEach(e => {
          numberMap[e.wrapped.number()] = e;
        });
        this.wrapped.updateConnections(numberMap);
      }
    }

    tileDataAction(_positionGrid, fn) {
      this.wrapped.tileDataAction(fn);
    }

    getData() {
      return this.wrapped.toObject();
    }

    setRecipe(recipe) {
      if (typeof this.wrapped.recipe === 'function') {
        this.wrapped.recipe(recipe);
      }
    }

    setBar(bar) {
      if (typeof bar === 'number' && bar < 0) throw new Error('You must provide a positive value to setBar()');
      this.wrapped.bar(typeof bar !== 'number' ? -1 : bar);
    }

    setFilter(idx, type) {
      this.wrapped.withFilter(idx, type);
    }

    connect(other, mySide, theirSide, colour) {
      const myActualSide = mySide ? mySide : 1;
      const theirActualSide = theirSide ? theirSide : 1;
      this.wrapped.connectTo(other.wrapped, myActualSide, theirActualSide, colour);
    }

    set id(id) {
      this.wrapped.number(id);
    }
    get id() {
      this.wrapped.number();
    }
    get x() {
      return this.wrapped.x();
    }
    get y() {
      return this.wrapped.y();
    }
    get position() {
      return this.wrapped.position();
    }
    get direction() {
      return this.wrapped.direction();
    }
    get name() {
      return this.wrapped.name().replace(/-/g, '_');
    }
    get bar() {
      return this.wrapped.bar();
    }
    get recipe() {
      return this.wrapped.recipe().replace(/-/g, '_');
    }
    get modules() {
      return this.wrapped.modules();
    }
    set modules(obj) {
      return this.wrapped.modules(obj);
    }
    get filters() {
      return this.wrapped.filters();
    }
    get requestFilters() {
      return this.wrapped.logisticFilters();
    }
    fnApply(fnName, apply) {
      if (typeof this.wrapped[fnName] === 'function') {
        const result = this.wrapped[fnName]();
        if (typeof this.wrapped[fnName]() !== 'undefined') {
          return apply(result);
        }
      }
    }
    get condition() {
      const result = {};
      this.fnApply('circuitControlEnabled', r => result.controlEnable = r);

      this.fnApply('circuitControlFirstSignal', r => result.left = r.name.replace(/-/g, '_'));
      this.fnApply('arithmeticConditionFirstSignal', r => result.left = r.name.replace(/-/g, '_'));
      this.fnApply('deciderConditionFirstSignal', r => result.left = r.name.replace(/-/g, '_'));

      this.fnApply('circuitControlComparator', r => result.operator = r);
      this.fnApply('arithmeticConditionOperation', r => result.operator = r);
      this.fnApply('deciderConditionComparator', r => result.operator = r);

      this.fnApply('circuitControlConstant', r => result.right = r);
      this.fnApply('circuitControlSecondSignal', r => result.right = r.name.replace(/-/g, '_'));
      this.fnApply('arithmeticConditionSecondConstant', r => result.right = r);
      this.fnApply('arithmeticConditionSecondSignal', r => result.right = r.name.replace(/-/g, '_'));
      this.fnApply('deciderConditionConstant', r => result.right = r);

      this.fnApply('arithmeticConditionOutputSignal', r => result.out = r.name.replace(/-/g, '_'));

      return result;
    }
    // TODO implement request filter mixin.
//    get requestFilters() {
//      return this.wrapped.modules();
//    }
  }

  return Entity;
};

// vi: sts=2 ts=2 sw=2 et