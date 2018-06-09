

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
  function createType(name) {
//        console.log(entityData);
    const staticEntityData = entityData[nameToKey(name)];
    console.log("static data for: ", name, nameToKey(name), staticEntityData);

    // least specific to the most specific; thus any specific implementation
    // can override the generic implementation.
    features = [];

    if (staticEntityData.type === 'item') {
      features.push(entitytypes.Position);
      features.push(entitytypes.Direction);
    }
    if (name.endsWith('filter_inserter')) {
      features.push(entitytypes.Filter);
    }
    if (staticEntityData.inventorySize) {
      features.push(entitytypes.Inventory);
    }
    if (staticEntityData.modules) {
      features.push(entitytypes.Modules);
    }

    console.log("using features: ", features);
    return mixwith.mix(entitytypes.BaseEntity).with(...features);
  }

  class Entity {
    constructor(data, _positionGrid, _bp, center) {
      this.wrapped = new (getType(data.name))();
      console.log(Object.getOwnPropertyNames(this.wrapped));
      this.wrapped.fromObject({...entityData[nameToKey(data.name)], ...data});
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

    place() {
      // xxx 
    }
  }

  return Entity;
};

// vi: sts=2 ts=2 sw=2 et