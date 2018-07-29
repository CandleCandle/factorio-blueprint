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
  };

module.exports = StraightRail;

// vi: sts=2 ts=2 sw=2 et
