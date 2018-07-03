"use strict";


const Victor = require('victor');
const mixwith = require('mixwith');

/* Current problems:
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
 *
 */


/*
 * Base Entity, should contain the bare minimum that is in every entity.
 *
 * Subclasses should override toObject and fromObject; ensuring that they
 * call the appropriate super.toObject / super.fromObject.
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
 * Mixins: implement a bit of entity functionality.
 *
 * each has:
 * * toObject that merges it's bit of functionality into the final result
 * * fromObject that extracts the bits it needs from a freshly parsed blueprint
 * * various builder/getter-style methods that: when supplied with 0 arguments
 *     returns that value; when supplied with arguments sets the property
 *     and returns this
 *
 */


/**
 * Not every placeable entity has/needs a direction: e.g. heat pipes; stone walls; nuclear reactors.
 */
const Direction = (superclass) => class extends superclass {
    // direction: int

    /**
     * gets or sets the direction for the entity.
     * @param {int} direction direction for this entity to be facing
     * @return {int, this} when supplied with 0 arguments, returns the direction the entity is facing, when supplied with 'direction' sets the direction and returns the entity itself to allow for method chaining.
     */
    direction(direction) {
      return this._property('_direction', direction);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.direction) {
        this.direction(obj.direction);
      } else {
        this.direction(0);
      }
    }

    toObject() {
      const mine = {
        direction: this.direction()
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

/**
 * Placeable entities must have a position; and by that virtue, are highly likely
 * to also have a width and height.
 *
 * Coordinate systems:
 * This library has every entity placed in the grid with it's top-left corner
 * being the 'location' and the width and height extending down and right.
 *
 * Factorio uses the centre of the entity as the placement location; except,
 * it seems, 1x1 entities.
 */
const Position = (superclass) => class extends superclass {
    // position: Victor
    // width: int
    // height: int

    position(position) {
      return this._property('_position', position);
    }

    x(x) {
      if (typeof this._position === 'undefined') this.position(new Victor(0, 0));
      if (!x) return this._position.x;
      this._position.x = x;
      return this;
    }

    y(y) {
      if (typeof this._position === 'undefined') this.position(new Victor(0, 0));
      if (!y) return this._position.y;
      this._position.y = y;
      return this;
    }

    width(width) {
      return this._property('_width', width);
    }

    height(height) {
      return this._property('_height', height);
    }

    /**
     * calls fn with every x/y coordinate combination that this entity overlaps
     * @param {function} fn 2-parameter function; parameters are (x, y)
     */
    tileDataAction(fn) {
      const size = this.effectiveSize();
      for (let y = this.y(); y < (this.y() + size.y); ++y) {
        for (let x = this.x(); x < (this.x() + size.x); ++x) {
          fn(x, y);
        }
      }
    }

    effectiveSize() {
      const size = new Victor(this.width(), this.height());
      if (typeof this.direction === 'function') {
        // if this type has a direction, and it's E or W then swap the x/y of the size.
        if (this.direction() === 2 || this.direction() === 6) {
          const t = size.x;
          size.x = size.y;
          size.y = t;
        }
      }
      return size;
    }

    fromObject(obj) {
      super.fromObject(obj);
      // Set the default width and height to 1.
      if (obj.width) { this.width(obj.width); } else { this.width(1); }
      if (obj.height) { this.height(obj.height); } else { this.height(1); }

      if (obj.position) {
        // move the actual coordinates to the centre of the entity then move to the top-left corner.
        const size = this.effectiveSize();
        const pos = new Victor(obj.position.x, obj.position.y)
            .add(new Victor(0.5, 0.5))
            .subtract(size.clone().divide(new Victor(2,2)));
        // XXX normally, the coordinates are the centre of the entity minus
        // (0.5,0.5), leading to 1x1,3x3,etc entities having integral positions
        // and 2x2,4x4,etc entities having '.5' offsets, however, if the
        // blueprint has rails then this is reversed with the even dimensions
        // having integral coordinates.
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        this.position(pos);
      }

    }

    toObject() {

      // move the actual coordinates to the centre of the entity then move to the top-left corner.
      const size = this.effectiveSize();
      const adjustedPosition = this.position().clone()
        .add(size.clone().divide(new Victor(2,2)))
        .subtract(new Victor(0.5, 0.5));
      const mine = {
        position: {x: adjustedPosition.x, y: adjustedPosition.y}
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

/**
 * logistic filters: buffer and requester chests have type/quantity pairs.
 * section.
 */
const LogisticFilter = (superclass) => class extends superclass {
    // filters: object: {int: string}

    logisticFilters(filters) {
      return this._property('_logisticFilters', filters);
    }

    withLogisticFilter(index, type, count) {
      if (typeof this.logisticFilters() === 'undefined') this.logisticFilters([]);
      this._logisticFilters[index] = {name: type, count: count};
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.request_filters) this.logisticFilters(
              obj.request_filters.reduce((acc, v) => {
                // -1 is to shift from a 1-indexed list to 0 indexed.
                acc[(+v.index) -1] = {name: v.name.replace(/-/g, '_'), count: v.count};
                return acc;
              }, {})
            );
    }

    toObject() {
      const mine = {};
      if (this.logisticFilters()) {
        mine.request_filters = Object.entries(this.logisticFilters())
                  .map(e => {
                    // +1 is to shift from a 0-indexed list to a 1-indexed list.
                    return {
                      index: (+e[0]) + 1,
                      name: e[1].name.replace(/_/g, '-'),
                      count: e[1].count
                    };
                  });
      }

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

/**
 * filters: filter inserters & stack filter inserters both have a filters
 * section.
 */
const Filter = (superclass) => class extends superclass {
    // filters: object: {int: string}

    filters(filters) {
      return this._property('_filters', filters);
    }

    withFilter(index, type) {
      if (typeof this.filters() === 'undefined') this.filters({});
      this._filters[index] = type;
      return this;
    }

    addFilter(type) {
      // TODO find the next available slot for type; filling gaps as required
      this._filters[this._filters.size] = type;
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.filters) this.filters(
              obj.filters.reduce((acc, v) => {
                // -1 is to shift from a 1-indexed list to 0 indexed.
                acc[(+v.index) -1] = v.name.replace(/-/g, '_');
                return acc;
              }, {})

            );
    }

    toObject() {
      const mine = {
        filters: Object.entries(this.filters())
                .map(e => {
                  // +1 is to shift from a 0-indexed list to a 1-indexed list.
                  return {index: (+e[0]) + 1, name: e[1].replace(/_/g, '-')};
                })
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

/**
 * Items with an inventory usually have a maximum number of inventory slots and
 * a 'bar' that can stop machines putting items into some
 */
const Inventory = (superclass) => class extends superclass {
    // maxInventory: int
    // bar: int

    bar(bar) {
      return this._property('_bar', bar);
    }

    maxInventory(bar) {
      return this._property('_maxInventory', bar);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.maxInventory) this.maxInventory(obj.maxInventory);
      if (obj.bar) { this.bar(obj.bar); } else { this.bar(-1); };
    }

    toObject() {
      const mine = {};
      if (this.bar() !== -1) {
        mine.bar = this.bar();
      }

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

const CircuitControl = (superclass) => class extends superclass {

    circuitControlFirstSignal(name, type) {
      if (typeof name !== 'undefined' && typeof type !== 'undefined') {
        var obj = {name: name, type: type};
      }
      return this._property('_circuitControlFirstSignal', obj);
    }

    circuitControlSecondSignal(name, type) {
      if (typeof name !== 'undefined' && typeof type !== 'undefined') {
        var obj = {name: name, type: type};
      }
      return this._property('_circuitControlSecondSignal', obj);
    }

    circuitControlConstant(value) {
      return this._property('_circuitControlConstant', value);
    }

    circuitControlComparator(value) {
      return this._property('_circuitControlComparator', value);
    }

    circuitControlEnabled(value) {
      return this._property('_circuitControlEnabled', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.circuit_condition) {
        const cc = obj.control_behavior.circuit_condition;
        if (obj.control_behavior.circuit_enable_disable) this.circuitControlEnabled(obj.control_behavior.circuit_enable_disable);
        if (cc.first_signal) this.circuitControlFirstSignal(cc.first_signal.name, cc.first_signal.type);
        if (cc.second_signal) this.circuitControlSecondSignal(cc.second_signal.name, cc.second_signal.type);
        if (cc.constant) this.circuitControlConstant(cc.constant);
        if (cc.comparator) this.circuitControlComparator(cc.comparator);
      }
    }


    toObject() {
      const mine = {
        control_behavior: {
          circuit_enable_disable: this.circuitControlEnabled(),
          circuit_condition: {
            first_signal: this.circuitControlFirstSignal(),
            comparator: this.circuitControlComparator(),

            constant: this.circuitControlConstant(),
            second_signal: this.circuitControlSecondSignal()
          },
          circuit_enable_disable: true
        }
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
  };

const Modules = (superclass) => class extends superclass {
    // items: object: {module_type: count}
    // modules: int // max count of modules

    maxModules(maxModules) {
      return this._property('_maxModules', maxModules);
    }

    modules(modules) {
      return this._property('_modules', modules);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.modules) this.maxModules(obj.modules);
      if (obj.items) {
        this.modules(
                Object.entries(obj.items)
                .reduce((acc, v) => {
                  acc[v[0].replace(/-/g, '_')] = v[1];
                  return acc;
                }, {}));
      } else {
        this.modules({});
      };
    }

    toObject() {
      const mine = {
        // fix key names to use hyphens and not underscores.
        items: Object.entries(this.modules())
                .reduce((acc, v) => {
                  acc[v[0].replace(/_/g, '-')] = v[1];
                  return acc;
                }, {})
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };


const Recipe = (superclass) => class extends superclass {
    // recipe: string: recipe name

    recipe(recipe) {
      return this._property('_recipe', recipe);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.recipe) this.recipe(obj.recipe);
    }

    toObject() {
      const mine = {
        recipe: this.recipe().replace(/_/g, '-')
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

class Connection {
  // side, colour ==> entity
  // colour is optional (see Cu0/Cu1 for manual copper connections - mostly found in power switches)
  // theirSide is also optional; Cu0/Cu1 don't show up on the other side
  constructor(otherEntity, mySide, theirSide, colour) {
    this.otherEntity = otherEntity;
    this.mySide = mySide;
    this.theirSide = theirSide;
    this.colour = colour;
  }

  static sideMapping(side) {
    mapping = {
      '1': 'in',
      '2': 'out',
      'in': '1',
      'out': '2',
      'Cu0': 'Cu0',
      'Cu1': 'Cu1'
    };
    return mapping[side];
  }
}

class ConnectionsTable {
  constructor(connectionsList) {
    this.table = connectionsList;
  }

  get(side, colour) {
    let result = [];
    this.table.forEach(e => {
      if ((e.mySide === side) && (e.colour === colour)) {
        result.push(e);
      }
    });
    return result;
  }

  add(connection) {
    // TODO validation & de-duplication
    // check that there is not already a matching connection
    this.table.push(connection);
  }
}

const Connections = (superclass) => class extends superclass {
    constructor() {
      super();
      this._connections = new ConnectionsTable([]);
    }

    connections() {
      return this._connections;
    }

    connectTo(otherEntity, mySide, theirSide, colour) {
      this._connections.add(new Connection(otherEntity, mySide, theirSide, colour));
      otherEntity._connections.add(new Connection(this, theirSide, mySide, colour));
    }

    fromObject(obj) {
      super.fromObject(obj);
      this._rawConnections = obj.connections;
    }

    updateConnections(entityNumberMap) {
      if (typeof this._rawConnections === 'undefined') return; // early exit for entities that have no connections.
      // Example _rawConnections
      // {
      //   '1': { red: [ { entity_id: 1 } ] },
      //   'Cu1': [ { entity_id: 3, wire_id: 0 } ] }
      // }
      const list = [];

      // function to parse the list of connected entities then create and store
      // the Connection objects. As a function because the arary to handle
      // can be located at different places in the object.
      const handleEntityConnectionList = (l, ms, ts, c) => {
        l.forEach(entityObj => {
          list.push(new Connection(entityNumberMap[entityObj.entity_id], ms, ts, c));
        });
      };

      // read the connections block and flatten to lists of connections
      Object.keys(this._rawConnections).forEach(side => {
        if (Array.isArray(this._rawConnections[side])) {
          // Cu0/1; copper connections; usually found in power switches.
          // XXX not sure what the wire_id field is for, so ignoring for now.
          handleEntityConnectionList(this._rawConnections[side], side, null);
        } else {
          // in(1)/out(2); usually red & green wires.
          Object.keys(this._rawConnections[side]).forEach(colour => {
            handleEntityConnectionList(this._rawConnections[side][colour], side, null, colour);
          });
        }
      });

      this._connections = new ConnectionsTable(list);
    }

    toObject() {
      const mine = {
        connections: {}
      };
      this._connections.table.forEach(c => {
        var arr;
        if (typeof c.colour === 'undefined') {
          if (typeof mine.connections[c.mySide] === 'undefined') mine.connections[c.mySide] = [];
          arr = mine.connections[c.mySide];
        } else {
          if (typeof mine.connections[c.mySide] === 'undefined') mine.connections[c.mySide] = {};
          if (typeof mine.connections[c.mySide][c.colour] === 'undefined') mine.connections[c.mySide][c.colour] = [];
          arr = mine.connections[c.mySide][c.colour];
        }
        arr.push({ entity_id: c.otherEntity.number() });
      });

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

const ArithmeticCombinator = (superclass) => class extends superclass {

    arithmeticConditionFirstSignal(value) {
      return this._property('_arithmeticConditionFirstSignal', value);
    }

    arithmeticConditionOperation(value) {
      return this._property('_arithmeticConditionOperation', value);
    }

    arithmeticConditionSecondConstant(value) {
      return this._property('_arithmeticConditionSecondConstant', value);
    }

    arithmeticConditionSecondSignal(value) {
      return this._property('_arithmeticConditionSecondSignal', value);
    }

    arithmeticConditionOutputSignal(value) {
      return this._property('_arithmeticConditionOutputSignal', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.arithmetic_conditions) {
        // <output_signal> = <first_signal> <operator> {<second_constant> XOR <second_signal>}
        const ac = obj.control_behavior.arithmetic_conditions;
        if (ac.first_signal) this.arithmeticConditionFirstSignal(ac.first_signal);
        if (ac.second_constant) this.arithmeticConditionSecondConstant(ac.second_constant);
        if (ac.second_signal) this.arithmeticConditionSecondSignal(ac.second_signal);
        if (ac.operation) this.arithmeticConditionOperation(ac.operation);
        if (ac.output_signal) this.arithmeticConditionOutputSignal(ac.output_signal);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          arithmetic_conditions: {
            first_signal: this.arithmeticConditionFirstSignal(),

            operation: this.arithmeticConditionOperation(),

            second_signal: this.arithmeticConditionSecondSignal(),
            second_constant: this.arithmeticConditionSecondConstant(),

            output_signal: this.arithmeticConditionOutputSignal()
          }
        }
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
};

const DeciderCombinator = (superclass) => class extends superclass {

    deciderConditionFirstSignal(value) {
      return this._property('_deciderConditionFirstSignal', value);
    }

    deciderConditionComparator(value) {
      return this._property('_deciderConditionComparator', value);
    }

    deciderConditionConstant(value) {
      return this._property('_deciderConditionConstant', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.decider_conditions) {
        // <output_signal> = <first_signal> <operator> {<second_constant> XOR <second_signal>}
        const dc = obj.control_behavior.decider_conditions;
        if (dc.first_signal) this.deciderConditionFirstSignal(dc.first_signal);
        if (dc.comparator) this.deciderConditionComparator(dc.comparator);
        if (dc.constant) this.deciderConditionConstant(dc.constant);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          decider_conditions: {
            first_signal: this.deciderConditionFirstSignal(),
            comparator: this.deciderConditionComparator(),
            constant: this.deciderConditionConstant()
          }
        }
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
};

module.exports = {
  BaseEntity: BaseEntity,
  Filter: Filter,
  LogisticFilter: LogisticFilter,
  Direction: Direction,
  Position: Position,
  Inventory: Inventory,
  CircuitControl: CircuitControl,
  Modules: Modules,
  Recipe: Recipe,
  Connections: Connections,
  ArithmeticCombinator: ArithmeticCombinator,
  DeciderCombinator: DeciderCombinator
};

// vi: sts=2 ts=2 sw=2 et