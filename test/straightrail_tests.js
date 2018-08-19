const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');
const Blueprint = require('../src/index');



describe('Entity Features', function () {
  describe('straignt rail segments', function () {
    const StraightRailEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position, entity.StraightRail);

    it('performs an action for all 5 squares with a direction of 1', function () {
      const entity = new StraightRailEntity();
      entity.fromObject({
        name: 'straight-rail',
        width: 2,
        height: 2,
        direction: 1,
        position: {x: 12, y: 12}
      });
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 5);
      assert.equal(visited["12,11"], 1);
      assert.equal(visited["12,10"], 1);
      assert.equal(visited["12,12"], 1);
      assert.equal(visited["11,11"], 1);
      assert.equal(visited["13,11"], 1);
    });
    it('performs an action for all 5 squares with a direction of 3', function () {
      const entity = new StraightRailEntity();
      entity.fromObject({
        name: 'straight-rail',
        width: 2,
        height: 2,
        direction: 3,
        position: {x: 12, y: 12}
      });
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 5);
      assert.equal(visited["12,12"], 1);
      assert.equal(visited["12,11"], 1);
      assert.equal(visited["12,13"], 1);
      assert.equal(visited["11,12"], 1);
      assert.equal(visited["13,12"], 1);
    });
    it('performs an action for all 5 squares with a direction of 5', function () {
      const entity = new StraightRailEntity();
      entity.fromObject({
        name: 'straight-rail',
        width: 2,
        height: 2,
        direction: 5,
        position: {x: 12, y: 12}
      });
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 5);
      assert.equal(visited["11,12"], 1);
      assert.equal(visited["11,11"], 1);
      assert.equal(visited["11,13"], 1);
      assert.equal(visited["10,12"], 1);
      assert.equal(visited["12,12"], 1);
    });
    it('performs an action for all 5 squares with a direction of 7', function () {
      const entity = new StraightRailEntity();
      entity.fromObject({
        name: 'straight-rail',
        width: 2,
        height: 2,
        direction: 7,
        position: {x: 12, y: 12}
      });
      const visited = {};
      entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
      assert.equal(Object.keys(visited).length, 5);
      assert.equal(visited["11,11"], 1);
      assert.equal(visited["11,10"], 1);
      assert.equal(visited["11,12"], 1);
      assert.equal(visited["10,11"], 1);
      assert.equal(visited["12,11"], 1);
    });
  });


  describe('straignt rail segments', function () {
    const StraightRailEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position, entity.StraightRail);

    describe('adjacent rail segments', function () {
      it('directions 0 and 4 are up&down and preserve entity direction', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(12, 12))
              .width(2).height(2)
              .direction(0);
        const result = entity.adjacentStraight();
        assert.equal(result[Blueprint.UP][0].position.x, 12);
        assert.equal(result[Blueprint.UP][0].position.y, 10);
        assert.equal(result[Blueprint.UP][0].direction, 0, 'up, direction ' + result[Blueprint.UP].d);
        assert.equal(result[Blueprint.DOWN][0].position.x, 12);
        assert.equal(result[Blueprint.DOWN][0].position.y, 14);
        assert.equal(result[Blueprint.DOWN][0].direction, 0, 'down, direction');
        [1,2,3,5,6,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 2 and 6 are right&left and preserve entity direction', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(12, 12))
              .width(2).height(2)
              .direction(2);
        const result = entity.adjacentStraight();
        assert.equal(result[Blueprint.LEFT][0].position.x, 10);
        assert.equal(result[Blueprint.LEFT][0].position.y, 12);
        assert.equal(result[Blueprint.LEFT][0].direction, 2);
        assert.equal(result[Blueprint.RIGHT][0].position.x, 14);
        assert.equal(result[Blueprint.RIGHT][0].position.y, 12);
        assert.equal(result[Blueprint.RIGHT][0].direction, 2);
        [0,1,3,4,5,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 1 and 5 are NW&SE and opposite entity direction', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(12, 12))
              .width(2).height(2)
              .direction(1);
        const result = entity.adjacentStraight();
        assert.equal(result[3][0].position.x, 12);
        assert.equal(result[3][0].position.y, 10);
        assert.equal(result[3][0].direction, 5);
        assert.equal(result[7][0].position.x, 14);
        assert.equal(result[7][0].position.y, 12);
        assert.equal(result[7][0].direction, 5);
        [0,1,2,4,5,6].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 3 and 7 are NE&SW and opposite entity direction', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(12, 12))
              .width(2).height(2)
              .direction(7);
        const result = entity.adjacentStraight();
        assert.equal(result[1][0].position.x, 12);
        assert.equal(result[1][0].position.y, 10);
        assert.equal(result[1][0].direction, 3);
        assert.equal(result[5][0].position.x, 10);
        assert.equal(result[5][0].position.y, 12);
        assert.equal(result[5][0].direction, 3);
        [0,2,3,4,6,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });

      it('directions 0 and 4 have four possible curve sections', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(1, 17))
              .width(2).height(2)
              .direction(0);
        const result = entity.adjacentCurve();
        assert.equal(result[0].length, 2);
        assert.equal(result[0][0].position.x, 0.5);
        assert.equal(result[0][0].position.y, 12.5);
        assert.equal(result[0][0].direction, 0);
        assert.equal(result[0][1].position.x, 2.5);
        assert.equal(result[0][1].position.y, 12.5);
        assert.equal(result[0][1].direction, 1);
        assert.equal(result[4].length, 2);
        assert.equal(result[4][0].position.x, 2.5);
        assert.equal(result[4][0].position.y, 22.5);
        assert.equal(result[4][0].direction, 4);
        assert.equal(result[4][1].position.x, 0.5);
        assert.equal(result[4][1].position.y, 22.5);
        assert.equal(result[4][1].direction, 5);
        [1,2,3,5,6,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 2 and 6 have four possible curve sections', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(17, 33))
              .width(2).height(2)
              .direction(2);
        const result = entity.adjacentCurve();
        assert.equal(result[2].length, 2);
        assert.equal(result[2][0].position.x, 22.5);
        assert.equal(result[2][0].position.y, 32.5);
        assert.equal(result[2][0].direction, 2);
        assert.equal(result[2][1].position.x, 22.5);
        assert.equal(result[2][1].position.y, 34.5);
        assert.equal(result[2][1].direction, 3);
        assert.equal(result[6].length, 2);
        assert.equal(result[6][0].position.x, 12.5);
        assert.equal(result[6][0].position.y, 34.5);
        assert.equal(result[6][0].direction, 6);
        assert.equal(result[6][1].position.x, 12.5);
        assert.equal(result[6][1].position.y, 32.5);
        assert.equal(result[6][1].direction, 7);
        [0,1,3,4,5,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 1 and 5 have four possible curve sections', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(5, 29))
              .width(2).height(2)
              .direction(1);
        const result = entity.adjacentCurve();
        assert.equal(result[3].length, 2);
        assert.equal(result[3][0].position.x, 6.5);
        assert.equal(result[3][0].position.y, 33.5);
        assert.equal(result[3][0].direction, 0);
        assert.equal(result[3][1].position.x, 9.5);
        assert.equal(result[3][1].position.y, 31.5);
        assert.equal(result[3][1].direction, 7);
        assert.equal(result[7].length, 2);
        assert.equal(result[7][0].position.x, 1.5);
        assert.equal(result[7][0].position.y, 27.5);
        assert.equal(result[7][0].direction, 3);
        assert.equal(result[7][1].position.x, 3.5);
        assert.equal(result[7][1].position.y, 25.5);
        assert.equal(result[7][1].direction, 4);
        [0,1,2,4,5,6].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
      it('directions 3 and 7 have four possible curve sections', function () {
        const entity = new StraightRailEntity()
              .name('straight-rail')
              .position(new Victor(5, 29))
              .width(2).height(2)
              .direction(3);
        const result = entity.adjacentCurve();
        console.log(result);
        assert.equal(result[1].length, 2);
        assert.equal(result[1][0].position.x, 6.5); // +1.5
        assert.equal(result[1][0].position.y, 25.5); // -3.5
        assert.equal(result[1][0].direction, 5);
        assert.equal(result[1][1].position.x, 9.5); // +4.5
        assert.equal(result[1][1].position.y, 27.5); // -1.5
        assert.equal(result[1][1].direction, 6);
        assert.equal(result[5].length, 2);
        assert.equal(result[5][0].position.x, 3.5); // -1.5
        assert.equal(result[5][0].position.y, 33.5); // +4.5
        assert.equal(result[5][0].direction, 1);
        assert.equal(result[5][1].position.x, 1.5); // -3.5
        assert.equal(result[5][1].position.y, 31.5); // +2.5
        assert.equal(result[5][1].direction, 2);
        [0,2,3,4,6,7].forEach(d => assert.equal(typeof result[d], 'undefined', "expected "+d+" to not be defined, was "+result[d]));
      });
    });
  });
});


// vi: sts=2 ts=2 sw=2 et