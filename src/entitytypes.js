"use strict";


const Victor = require('victor');
const mixwith = require('mixwith');


// XXX current major flaw: the re-assignment of obj.x from a function to a property breaks most things! Either prefix the properties with _, or use different names for the functions.

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

  toObject() {
    return {
      name: this._name
    };
  }

  fromObject(entityObject) {
    this._name = entityObject.name;
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
    if (typeof value === 'undefined')
      return this[name];
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
      if (obj.direction)
        this.direction(obj.direction);
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
      if (typeof this._position === 'undefined')
        this.position(new Victor({x: 0, y: 0}));
      if (!x)
        return this.position.x;
      this.position.x = x;
      return this;
    }

    y(y) {
      if (typeof this._position === 'undefined')
        this.position(new Victor({x: 0, y: 0}));
      if (!y)
        return this.position.y;
      this.position.y = y;
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
      if (obj.position)
        this.position(new Victor(obj.position));
      if (obj.width)
        this.width(obj.width);
      if (obj.height)
        this.height(obj.height);
    }

    toObject() {
      const mine = {
        position: {x: this.position.x, y: this.position.y}
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
      this._filters[this.filters.size] = type;
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.filters)
        this.filters(obj.filters);
    }

    toObject() {
      const mine = {
        filters: this._filters
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
      if (obj.maxInventory)
        this.maxInventory(obj.maxInventory);
      if (obj.bar)
        this.bar(obj.bar);
    }

    toObject() {
      const mine = {
        bar: this.bar
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

const CircuitControl = (superclass) => class extends superclass {

    toObject() {
      const mine = {
        control_behavior: {
          circuit_condition: {/* more here */},
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
      return this._property('_items', modules);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.modules)
        this.maxModules(obj.modules);
      if (obj.items)
        this.modules(obj.items);
    }

    toObject() {
      const mine = {
        items: this.items
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
      if (obj.recipe)
        this.recipe(obj.recipe);
    }

    toObject() {
      const mine = {
        recipe: this.recipe
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
  Modules: Modules,
  Recipe: Recipe
};

// vi: sts=2 ts=2 sw=2 et