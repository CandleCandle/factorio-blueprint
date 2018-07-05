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

module.exports = Direction;
