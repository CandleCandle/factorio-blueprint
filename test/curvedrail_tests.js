const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');
const Blueprint = require('../src/index');



describe('Entity Features', function () {
  describe('curved rail segments', function () {
    const CurvedRailEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position, entity.CurvedRail);

    it('performs an action for all 16 squares with a direction of 0', function () {
      const entity = new CurvedRailEntity()
            .name('curved-rail')
            .position(new Victor(1.5, 2.5))
            .width(1).height(1)
            .direction(0);
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 16);
      assert.equal(visited["0,0"], 1);
      assert.equal(visited["1,0"], 1);
      assert.equal(visited["0,1"], 1);
      assert.equal(visited["1,1"], 1);
      assert.equal(visited["0,2"], 1);
      assert.equal(visited["1,2"], 1);
      assert.equal(visited["2,2"], 1);
      assert.equal(visited["1,3"], 1);
      assert.equal(visited["2,3"], 1);
      assert.equal(visited["3,3"], 1);
      assert.equal(visited["2,4"], 1);
      assert.equal(visited["3,4"], 1);
      assert.equal(visited["2,5"], 1);
      assert.equal(visited["3,5"], 1);
      assert.equal(visited["2,6"], 1);
      assert.equal(visited["3,6"], 1);
    });
    it('performs an action for all 16 squares with a direction of 2', function () {
      const entity = new CurvedRailEntity()
            .name('curved-rail')
            .position(new Victor(3.5, 1.5))
            .width(1).height(1)
            .direction(2);
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 16);
      assert.equal(visited["4,0"], 1);
      assert.equal(visited["5,0"], 1);
      assert.equal(visited["6,0"], 1);
      assert.equal(visited["3,1"], 1);
      assert.equal(visited["4,1"], 1);
      assert.equal(visited["5,1"], 1);
      assert.equal(visited["6,1"], 1);
      assert.equal(visited["0,2"], 1);
      assert.equal(visited["1,2"], 1);
      assert.equal(visited["2,2"], 1);
      assert.equal(visited["3,2"], 1);
      assert.equal(visited["4,2"], 1);
      assert.equal(visited["0,3"], 1);
      assert.equal(visited["1,3"], 1);
      assert.equal(visited["2,3"], 1);
      assert.equal(visited["3,3"], 1);
    });
    it('performs an action for all 16 squares with a direction of 4', function () {
      const entity = new CurvedRailEntity()
            .name('curved-rail')
            .position(new Victor(1.5, 3.5))
            .width(1).height(1)
            .direction(4);
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 16);
      assert.equal(visited["0,0"], 1);
      assert.equal(visited["1,0"], 1);
      assert.equal(visited["0,1"], 1);
      assert.equal(visited["1,1"], 1);
      assert.equal(visited["0,2"], 1);
      assert.equal(visited["1,2"], 1);
      assert.equal(visited["0,3"], 1);
      assert.equal(visited["1,3"], 1);
      assert.equal(visited["2,3"], 1);
      assert.equal(visited["1,4"], 1);
      assert.equal(visited["2,4"], 1);
      assert.equal(visited["3,4"], 1);
      assert.equal(visited["2,5"], 1);
      assert.equal(visited["3,5"], 1);
      assert.equal(visited["2,6"], 1);
      assert.equal(visited["3,6"], 1);
    });
    it('performs an action for all 16 squares with a direction of 6', function () {
      const entity = new CurvedRailEntity()
            .name('curved-rail')
            .position(new Victor(2.5, 1.5))
            .width(1).height(1)
            .direction(6);
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 16);
      assert.equal(visited["3,0"], 1);
      assert.equal(visited["4,0"], 1);
      assert.equal(visited["5,0"], 1);
      assert.equal(visited["6,0"], 1);
      assert.equal(visited["2,1"], 1);
      assert.equal(visited["3,1"], 1);
      assert.equal(visited["4,1"], 1);
      assert.equal(visited["5,1"], 1);
      assert.equal(visited["6,1"], 1);
      assert.equal(visited["0,2"], 1);
      assert.equal(visited["1,2"], 1);
      assert.equal(visited["2,2"], 1);
      assert.equal(visited["3,2"], 1);
      assert.equal(visited["0,3"], 1);
      assert.equal(visited["1,3"], 1);
      assert.equal(visited["2,3"], 1);
    });
  });

  describe('adjacent rail segments', function(){}, function () {
    const CurvedRailEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position, entity.CurvedRail);
    it('direction 0', function () {
      const entity = new CurvedRailEntity()
            .name('curved-rail')
            .position(new Victor(12, 12))
            .width(1).height(1)
            .direction(0);
      const result = entity.adjacentStraight();
      assert.equal(result[Blueprint.UP][0].position.x, 12);
      assert.equal(result[Blueprint.UP][0].position.y, 10);
      assert.equal(result[Blueprint.UP][0].direction, 0, 'up, direction ' + result[Blueprint.UP].d);
      assert.equal(result[Blueprint.DOWN][0].position.x, 12);
      assert.equal(result[Blueprint.DOWN][0].position.y, 14);
      assert.equal(result[Blueprint.DOWN][0].direction, 0, 'down, direction');
      [0,1,2,3,4,5,6,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
    });
  });
});


// vi: sts=2 ts=2 sw=2 et