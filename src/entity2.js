

const Victor = require('victor');



/*
 * Builder to make the syntax considerably easier to read
 */
let mix = (superclass) => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}


/*
 * Base Entity, should contain the bare minimum that is in every entity.
 */
class BaseEntity {
    // name
    // type (item, recipe, tile, virtual, fluid)

    name(name) {
        return this._property('name', name);
    }

    type(type) {
        return this._property('type', type);
    }

    toObject() {
        return {
            name: this.name
        };
    }

    fromObject(entityObject) {
        this.name = entityObject.name;
        this.type = entityObject.type;
    }

    /**
     * utility function to wrap the getter&builder behaviour
     * @param {type} name name of the property to get/set
     * @param {type} value if presant, causes the function to set the property and return 'this' for method chaining, if missing, causes the functino to return the current value of the property.
     * @return {BaseEntity}
     */
    _property(name, value) {
        if (!value) return this[name];
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


Direction = (superclass) => class extends superclass {
    // direction

    /**
     * gets or sets the direction for the entity.
     * @param {int} direction direction for this entity to be facing
     * @return {int, this} when supplied with 0 arguments, returns the direction the entity is facing, when supplied with 'direction' sets the direction and returns the entity itself to allow for method chaining.
     */
    direction(direction) {
        return this._property('direction', direction);
    }

    toObject() {
        const mine = {
            direction: this.direction
        };

        const sup = (super.toObject) ? super.toObject() : {};
        return {...sup, ...mine};
    }
};

Position = (superclass) => class extends superclass {
    // position: Victor

    position(position) {
        return this._property('position', position);
    }

    x(x) {
        if (!this.position) this.position = new Victor({x: 0, y: 0});
        if (!x) return position.x;
        this.position.x = x;
        return this;
    }

    y(y) {
        if (!this.position) this.position = new Victor({x: 0, y: 0});
        if (!y) return position.y;
        this.position.y = y;
        return this;
    }

    toObject() {
        const mine = {
            position: {x: this.position.x, y: this.position.y}
        };

        const sup = (super.toObject) ? super.toObject() : {};
        return {...sup, ...mine};
    }
};


Filters = (superclass) => class extends superclass {
    // filters

    filters(filters) {
        return this._property('filters', filters);
    }

    withFilter(index, type) {
        this.filters[index] = type;
        return this;
    }

    addFilter(type) {
        // find the next available slot for type.
        this.filters[this.filters.size] = type;
        return this;
    }

    toObject() {
        const mine = {
            filters: this.filters
        };

        const sup = (super.toObject) ? super.toObject() : {};
        return {...sup, ...mine};
    }
};

Inventory = (superclass) => class extends superclass {

    bar(bar) {
        return this._property('bar', bar);
    }

    toObject() {
        const mine = {
            bar: this.bar
        };

        const sup = (super.toObject) ? super.toObject() : {};
        return {...sup, ...mine};
    }
}

CircuitControl = (superclass) => class extends superclass {

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

module.exports = {
    mix: mix,
    BaseEntity: BaseEntity,
    Filters: Filters,
    Direction: Direction,
    Position: Position,
    Inventory: Inventory
};
