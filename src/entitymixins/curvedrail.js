const Victor = require('victor');

const CurvedRail = (superclass) => class extends superclass {
    constructor() {
      super();
      this.area = [ // the general shape of a curved rail segment.
        new Victor(0,0),
        new Victor(1,0),
        new Victor(0,1),
        new Victor(1,1),
        new Victor(0,2),
        new Victor(1,2),
        new Victor(2,2),
        new Victor(1,3),
        new Victor(2,3),
        new Victor(3,3),
        new Victor(2,4),
        new Victor(3,4),
        new Victor(2,5),
        new Victor(3,5),
        new Victor(2,6),
        new Victor(3,6)
      ].map(v => {
        return v.clone().add(new Victor(-2,-3));
      });
    }

    tileDataAction(fn) {
      const offsetForDirection = d => {
        switch (d) {
        case 0: return new Victor(0.5, 0.5);
        case 2: return new Victor(-0.5, 0.5);
        case 4: return new Victor(-0.5, -0.5);
        case 6: return new Victor(0.5, -0.5);
        default: return new Victor(0, 0);
        }
      };
      switch (this.direction()) {
      case 0:
      case 2:
      case 4:
      case 6:
        this.area.map(c => {
          return c.clone()
                  .rotateDeg(this.direction() * 45)
                  .multiply({x: 10, y: 10})
                  .unfloat()
                  .divide({x: 10, y: 10})
                  .add(this.position())
                  .add(offsetForDirection(this.direction())) // fudge factor.
                  ;
        }).forEach(c => fn(c.x, c.y));
        break;
      default:
        return super.tileDataAction(fn);
      }
    }

    adjacentCurve() {

    }

    adjacentStraight() {

    }
  };

module.exports = CurvedRail;

// vi: sts=2 ts=2 sw=2 et
