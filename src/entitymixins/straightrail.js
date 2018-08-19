const Victor = require('victor');

class NextRail {
  constructor(outputDirection, entityPosition, entityDirection) {
    this.outputDirection = outputDirection;
    this.position = entityPosition;
    this.direction = entityDirection;
  }

  static toObject(list) {
    return list.reduce((acc, n) => {
      if (!acc[n.outputDirection]) acc[n.outputDirection] = [];
      acc[n.outputDirection].push(n);
      return acc;
    }, {});
  }
}

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

  adjacentCurve() {
    const result = [];
    const d = this.direction();
    const p = this.position();
    switch(d) {
    case 0:
    case 4:
      result.push(new NextRail(0, this.position().clone().add({x: -0.5, y: -4.5}), 0));
      result.push(new NextRail(0, this.position().clone().add({x: +1.5, y: -4.5}), 1));
      result.push(new NextRail(4, this.position().clone().add({x: +1.5, y: +5.5}), 4));
      result.push(new NextRail(4, this.position().clone().add({x: -0.5, y: +5.5}), 5));
      break;
    case 1:
    case 5:
      result.push(new NextRail(3, this.position().clone().add({x: +1.5, y: +4.5}), 0));
      result.push(new NextRail(7, this.position().clone().add({x: -3.5, y: -1.5}), 3));
      result.push(new NextRail(7, this.position().clone().add({x: -1.5, y: -3.5}), 4));
      result.push(new NextRail(3, this.position().clone().add({x: +4.5, y: +2.5}), 7));
      break;
    case 2:
    case 6:
      result.push(new NextRail(2, this.position().clone().add({x: +5.5, y: -0.5}), 2));
      result.push(new NextRail(2, this.position().clone().add({x: +5.5, y: +1.5}), 3));
      result.push(new NextRail(6, this.position().clone().add({x: -4.5, y: +1.5}), 6));
      result.push(new NextRail(6, this.position().clone().add({x: -4.5, y: -0.5}), 7));
      break;
    case 3:
    case 7:
      result.push(new NextRail(5, this.position().clone().add({x: -1.5, y: +4.5}), 1));
      result.push(new NextRail(5, this.position().clone().add({x: -3.5, y: +2.5}), 2));
      result.push(new NextRail(1, this.position().clone().add({x: +1.5, y: -3.5}), 5));
      result.push(new NextRail(1, this.position().clone().add({x: +4.5, y: -1.5}), 6));
      break;
    }

    return NextRail.toObject(result);
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
    const result = [];
    const d = this.direction();
    switch(d) {
    case 0:
    case 4:
      result.push(new NextRail(0, this.position().clone().add({x: 0, y: -2}), d));
      result.push(new NextRail(4, this.position().clone().add({x: 0, y: +2}), d));
      break;
    case 1:
    case 5:
      result.push(new NextRail(3, this.position().clone().add({x: -1, y: -1}).add(unitForDirection(d)), (d+4) % 8));
      result.push(new NextRail(7, this.position().clone().add({x: +1, y: +1}).add(unitForDirection(d)), (d+4) % 8));
      break;
    case 2:
    case 6:
      result.push(new NextRail(2, this.position().clone().add({x: +2, y: 0}), d));
      result.push(new NextRail(6, this.position().clone().add({x: -2, y: 0}), d));
      break;
    case 3:
    case 7:
      result.push(new NextRail(1, this.position().clone().add({x: +1, y: -1}).add(unitForDirection(d)), (d+4) % 8));
      result.push(new NextRail(5, this.position().clone().add({x: -1, y: +1}).add(unitForDirection(d)), (d+4) % 8));
      break;
    }
    return NextRail.toObject(result);
  }
  };

module.exports = StraightRail;

// vi: sts=2 ts=2 sw=2 et
