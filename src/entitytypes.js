"use strict";


const Victor = require('victor');
const mixwith = require('mixwith');


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
      name: this.name(),
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
      if (obj.direction) this.direction(obj.direction);
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
      for (let y = this.y(); y < (this.y() + this.height()); ++y) {
        for (let x = this.x(); x < (this.x() + this.width()); ++x) {
          fn(x, y);
        }
      }
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.position) this.position(new Victor(obj.position.x, obj.position.y));
      if (obj.width) this.width(obj.width);
      if (obj.height) this.height(obj.height);
    }

    toObject() {
      const mine = {
        position: {x: this.x(), y: this.y()}
      };

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
      this._filters[index] = type;
      return this;
    }

    addFilter(type) {
      // find the next available slot for type.
      this._filters[this._filters.size] = type;
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.filters) this.filters(obj.filters);
    }

    toObject() {
      const mine = {
        filters: this.filters()
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
      if (obj.bar) this.bar(obj.bar);
    }

    toObject() {
      const mine = {
        bar: this.bar()
      };

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

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.circuit_condition) {
        const cc = obj.circuit_condition;
        if (cc.first_signal) this.circuitControlFirstSignal(cc.first_signal.name, cc.first_signal.type);
        if (cc.second_signal) this.circuitControlSecondSignal(cc.second_signal.name, cc.second_signal.type);
        if (cc.constant) this.circuitControlConstant(cc.constant);
        if (cc.comparator) this.circuitControlComparator(cc.comparator);
      }
      if (obj.bar) this.bar(obj.bar);
    }


    toObject() {
      const mine = {
        control_behavior: {
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
      if (obj.items) this.modules(obj.items);
    }

    toObject() {
      const mine = {
        items: this.modules()
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
        recipe: this.recipe()
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

class Connection {
  // side, colour ==> entity
  // colour is optional (see Cu0/Cu1 for manual copper connections - mostly found in power switches)
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
    }
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
      if (typeof _rawConnections === 'undefiend') return; // early exit for entities that have no connections.
      const list = [];
//        connections: {
//          '1': {
//            red: [
//              { entity_id: 1 }
//            ]
//          },
//          'Cu1': [ { entity_id: 3, wire_id: 0 } ] }
//        }

      // function to parse the list of connected entities then create and store
      // the Connection objects.
      const handleEntityConnectionList = (l, ms, ts, c) => {
        l.forEach(entityObj => {
          list.push(new Connection(entityNumberMap[entityObj.entity_id], ms, ts, c));
        });
      };

      // read the connections block and flatten to lists of connections
      Object.keys(this._rawConnections).forEach(side => {
        if (typeof this._rawConnections[side] === 'object') {
          // in(1)/out(2); usually red & green wires.
          Object.keys(this._rawConnections[side]).forEach(colour => {
            handleEntityConnectionList(this._rawConnections[side][colour], side, null, colour);
          });
        } else {
          // Cu0/1; copper connections; usually found in power switches.
          // XXX not sure what the wire_id field is for, so ignoring for now.
          handleEntityConnectionList(this._rawConnections[side], side, null);
        }
      });

      this._connections = new ConnectionsTable(list);
    }

    toObject() {
      const mine = {
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = {
  BaseEntity: BaseEntity,
  Filter: Filter,
  Direction: Direction,
  Position: Position,
  Inventory: Inventory,
  CircuitControl: CircuitControl,
  Modules: Modules,
  Recipe: Recipe,
  Connections: Connections
};

// vi: sts=2 ts=2 sw=2 et