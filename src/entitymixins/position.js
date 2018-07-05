const Victor = require('victor');

/**
 * dimensions that are even (2x2) have positions that have are $centre-0.5
 * dimensions that are odd (1x1) have positions that have are $centre-0.5
 */
const grid_modes = {
    half_even: "half-even",
    half_odd : "half-odd"
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

    static gridModes() {
      return grid_modes;
    }
    gridMode(gridMode) {
      return this._property('_gridMode', position);
    }

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

module.exports = Position;

// vi: sts=2 ts=2 sw=2 et