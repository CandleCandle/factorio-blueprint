const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with directions', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const DirectionEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction);

    it('can get/set the direction property', function () {
      const entity = new DirectionEntity();
      assert.equal(entity.direction(6), entity); // setter returns the entity for function chaining.
      assert.equal(entity.direction(), 6);
    });
    it('can read from an input object', function () {
      const entity = new DirectionEntity();
      entity.fromObject({
        direction: 4
      });
      assert.equal(entity.direction(), 4);
    });
    it('can output to an object', function () {
      const entity = new DirectionEntity()
              .name('stone-wall')
              .direction(2)
              ;
      const obj = entity.toObject();
      assert.equal(obj.direction, 2);
    });
  });
});


// vi: sts=2 ts=2 sw=2 et