const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



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
});


// vi: sts=2 ts=2 sw=2 et