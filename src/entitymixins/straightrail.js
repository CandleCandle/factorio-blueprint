const Victor = require('victor');

const StraightRail = (superclass) => class extends superclass {

    /**
     * calls fn with every x/y coordinate combination that this entity overlaps
     * @param {function} fn 2-parameter function; parameters are (x, y)
     */
    tileDataAction(fn) {
      if (this.direction() % 2 === 0) {
        super.tileDataAction(fn);
      } else {
        // move coordinates 1 unit x and y in the direction that is supplied,
        // then use the cross (+1/-1 in x and y) that is centered on these coordinates
        let central = this.center().clone();
        central.x = Math.floor(central.x);
        central.y = Math.floor(central.y);
        if (this.direction() === 1) central.add(new Victor(+0, -1));
        if (this.direction() === 3) central.add(new Victor(+0, -0));
        if (this.direction() === 5) central.add(new Victor(-1, -0));
        if (this.direction() === 7) central.add(new Victor(-1, -1));
        fn(central.x, central.y);
        fn(central.x, central.y-1);
        fn(central.x, central.y+1);
        fn(central.x-1, central.y);
        fn(central.x+1, central.y);
      }
    }

  /**
   * returns an object with the keys being a direction; meaning "in this direction,
   * there can be a rail piece". The value is an object describing the position
   * and direction of the new rail piece.
   */
  adjacentStraight() {
    const unitForDirection = d => {
      switch (d) {
        case 1: return new Victor(+1, -1);
        case 3: return new Victor(+1, +1);
        case 5: return new Victor(-1, +1);
        case 7: return new Victor(-1, -1);
        default: return new Victor(0, 0);
      }
    };
    const result = {};
    const d = this.direction();
    console.log('this', this);
    if (d === 0 || d === 4) {
      result[0] = {
        position: this.position().clone().add({x: 0, y: -2}),
        direction: d
      };
      result[4] = {
        position: this.position().clone().add({x: 0, y: +2}),
        direction: d
      };
    }
    if (d === 1 || d === 5) {
      result[3] = {
        position: this.position().clone().add({x: -1, y: -1}).add(unitForDirection(d)),
        direction: (d+4) % 8
      };
      result[7] = {
        position: this.position().clone().add({x: +1, y: +1}).add(unitForDirection(d)),
        direction: (d+4) % 8
      };
    }
    if (d === 2 || d === 6) {
      result[2] = {
        position: this.position().clone().add({x: +2, y: 0}),
        direction: d
      };
      result[6] = {
        position: this.position().clone().add({x: -2, y: 0}),
        direction: d
      };
    }
    if (d === 3 || d === 7) {
      result[1] = {
        position: this.position().clone().add({x: +1, y: -1}).add(unitForDirection(d)),
        direction: (d+4) % 8
      };
      result[5] = {
        position: this.position().clone().add({x: -1, y: +1}).add(unitForDirection(d)),
        direction: (d+4) % 8
      };
    }
    return result;
  }
  };

module.exports = StraightRail;

// vi: sts=2 ts=2 sw=2 et
