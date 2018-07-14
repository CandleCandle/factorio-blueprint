const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');

describe('Entity Features', function () {
  describe('entities with positions', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const PositionEntity = mixwith.mix(entity.BaseEntity).with(entity.Position);
    const PositionDirectionEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position);

    it('can get/set the position property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.position(new Victor(5, -2)), entity);
      assert.deepStrictEqual(entity.position(), new Victor(5,-2));
    });
    it('can get/set the x property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.x(4), entity);
      assert.equal(entity.x(), 4);
      assert.equal(entity.y(), 0); // default for when only one of x/y is set.
    });
    it('can get/set the y property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.y(9), entity);
      assert.equal(entity.y(), 9);
      assert.equal(entity.x(), 0); // default for when only one of x/y is set.
    });
    it('can read from an input object', function () {
      const entity = new PositionEntity();
      entity.fromObject({
        name: 'stone-wall',
        position: {x: 5, y: 42}
      });
      assert.equal(entity.name(), 'stone-wall');
      assert.equal(entity.position().x, 5);
      assert.equal(entity.position().y, 42);
      assert.equal(entity.x(), 5);
      assert.equal(entity.y(), 42);
    });
    it('can output to an object', function () {
      const entity = new PositionEntity().name('stone-wall')
              .width(1).height(1) // normally set when the entity is created, from the static entitydata.
              .x(4).y(7)
              .gridMode(PositionEntity.gridModes().half_even) // normally calculated by the wrapping blueprint; half_even means there were no rails-related items in the blueprint.
              ;
      const obj = entity.toObject();
      assert.equal(obj.name, 'stone-wall');
      assert.equal(obj.position.x, 4);
      assert.equal(obj.position.y, 7);
    });
    it('can output non-square entities to an object', function () {
      const entity = new PositionDirectionEntity().name('boiler')
              .x(4).y(7).direction(2)
              .width(3).height(2) // normally set when the entity is created, from the static entitydata.
              .gridMode(PositionEntity.gridModes().half_even) // normally calculated by the wrapping blueprint; half_even means there were no rails-related items in the blueprint.
              ;
      const obj = entity.toObject();
      assert.equal(obj.name, 'boiler');
      // add 1/2 the size, then subtract 0.5, 0.5.
      assert.equal(obj.position.x, 4.5);
      assert.equal(obj.position.y, 8);
    });
    describe('half-even and half-odd coordinate systems', function() {
      describe('can convert from half-even centre to top-left', function() {
        // When there are no rails then the json-to-object conversion is:
        // $position+0.5-($size/2)
        // This is the half-even mode. (odd dimensions have coordinates that are integral)
        const inputData = [
          {centre: new Victor(0,0),     size: new Victor(1,1), expected: new Victor(0,0)},
          {centre: new Victor(1.5,5.5), size: new Victor(2,2), expected: new Victor(1,5)},
          {centre: new Victor(4,7),     size: new Victor(3,3), expected: new Victor(3,6)},
          {centre: new Victor(8.5,3.5), size: new Victor(4,4), expected: new Victor(7,2)},
          {centre: new Victor(1,4),     size: new Victor(5,5), expected: new Victor(-1,2)},

          {centre: new Victor(4.5,0),   size: new Victor(4,1), expected: new Victor(3,0)},
          {centre: new Victor(5,-1.5),  size: new Victor(3,6), expected: new Victor(4,-4)}
        ];
        inputData.forEach(data => {
          it('moves ' + data.centre + ' to ' + data.expected, function() {
            const result = PositionEntity.coordinatesCentreToTopLeft(data.centre, data.size, PositionEntity.gridModes().half_even);
            assert.equal(result.x, data.expected.x);
            assert.equal(result.y, data.expected.y);
          });
        });
      });
      describe('can convert from half-odd centre to top-left', function() {
        // When there are rails then the json-to-object conversion is:
        // $position-($size/2)
        // This is the half-odd mode. (even dimensions have coordinates that are integral)
        const inputData = [
          {centre: new Victor(0.5,0.5), size: new Victor(1,1), expected: new Victor(0,0)},
          {centre: new Victor(2,6),     size: new Victor(2,2), expected: new Victor(1,5)},
          {centre: new Victor(4.5,7.5), size: new Victor(3,3), expected: new Victor(3,6)},
          {centre: new Victor(9,4),     size: new Victor(4,4), expected: new Victor(7,2)},
          {centre: new Victor(1.5,4.5), size: new Victor(5,5), expected: new Victor(-1,2)},

          {centre: new Victor(5,0.5),   size: new Victor(4,1), expected: new Victor(3,0)},
          {centre: new Victor(5.5,-1),  size: new Victor(3,6), expected: new Victor(4,-4)}
        ];
        inputData.forEach(data => {
          it('moves ' + data.centre + ' to ' + data.expected, function() {
            const result = PositionEntity.coordinatesCentreToTopLeft(data.centre, data.size, PositionEntity.gridModes().half_odd);
            assert.equal(result.x, data.expected.x);
            assert.equal(result.y, data.expected.y);
          });
        });
      });
    });

    describe('tileDataAction', function () {
      // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
      it('performs an action for all tiles for a 1x1 square entity', function () {
        const entity = new PositionEntity();
        entity.fromObject({
          name: 'stone-wall',
          width: 1,
          height: 1,
          position: {x: 5, y: 42}
        });
        const visited = {};
        entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
        assert.equal(Object.keys(visited).length, 1);
        assert.equal(visited["5,42"], 1);
      });
      it('performs an action for all tiles for a single 3x3 square entity', function () {
        const entity = new PositionEntity();
        entity.fromObject({
          name: 'stone-wall',
          width: 3,
          height: 3
        });
        entity.x(0).y(0);

        const visited = {};
        entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
        assert.equal(Object.keys(visited).length, 9);
        assert.equal(visited["0,0"], 1);
        assert.equal(visited["1,0"], 1);
        assert.equal(visited["2,0"], 1);
        assert.equal(visited["0,1"], 1);
        assert.equal(visited["1,1"], 1);
        assert.equal(visited["2,1"], 1);
        assert.equal(visited["0,2"], 1);
        assert.equal(visited["1,2"], 1);
        assert.equal(visited["2,2"], 1);
      });
      it('performs an action for all tiles for a 2x2 square entity', function () {
        const entity = new PositionEntity();
        entity.fromObject({
          name: 'stone-wall',
          width: 2,
          height: 2,
          position: {x: 0.5, y: 0.5}
        });
        const visited = {};
        entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
        assert.equal(Object.keys(visited).length, 4);
        assert.equal(visited["0,0"], 1);
        assert.equal(visited["1,0"], 1);
        assert.equal(visited["0,1"], 1);
        assert.equal(visited["1,1"], 1);
      });
      describe('tileDataAction for non-square, rotated entities', function () {
        const coords = {
          0: {x: 1, y: 0.5},
          4: {x: 1, y: 0.5},
          2: {x: 0.5, y: 1},
          6: {x: 0.5, y: 1}
        };
        for (let rotation = 0; rotation <= 6; rotation += 2) {
          it('performs an action for all tiles for a rotated 3x2 square entity (rotation ' + rotation + ')', function () {
            const entity = new PositionDirectionEntity();
            entity.fromObject({
              name: 'heat_exchanger',
              width: 3,
              height: 2,
              direction: rotation,
              position: coords[rotation]
            });
            const visited = {};
            entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
            assert.equal(Object.keys(visited).length, 6);
            if (rotation === 0 || rotation === 4) {
              assert.equal(visited["0,0"], 1);
              assert.equal(visited["0,1"], 1);
              assert.equal(visited["1,0"], 1);
              assert.equal(visited["1,1"], 1);
              assert.equal(visited["2,0"], 1);
              assert.equal(visited["2,1"], 1);
            } else {
              assert.equal(visited["0,0"], 1);
              assert.equal(visited["0,1"], 1);
              assert.equal(visited["0,2"], 1);
              assert.equal(visited["1,0"], 1);
              assert.equal(visited["1,1"], 1);
              assert.equal(visited["1,2"], 1);
            }
          });
        }
      });
    });
  });
});


// vi: sts=2 ts=2 sw=2 et
