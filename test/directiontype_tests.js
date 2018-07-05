const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with direction types', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const DirectionTypeEntity = mixwith.mix(entity.BaseEntity).with(entity.DirectionType);

    it('can read from an input object', function () {
      const entity = new DirectionTypeEntity();
      entity.fromObject({
        direction_type: 'output'
      });
      assert.equal(entity.directionType(), 'output');
    });
    it('can output to an object', function () {
      const entity = new DirectionTypeEntity()
              .name('underground-belt')
              .directionType('input')
              ;
      const obj = entity.toObject();
      assert.equal(obj.direction_type, 'input');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et