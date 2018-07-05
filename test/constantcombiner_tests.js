const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('constant', function() {
    const ConstantCombinatorEntity = mixwith.mix(entity.BaseEntity).with(entity.ConstantCombinator);
    it('can read from an input object', function () {
      const entity = new ConstantCombinatorEntity();
      entity.fromObject({
        control_behavior: {
          filters: [{
            signal: { type: 'item', name: 'advanced-circuit' },
            count: 80,
            index: 8
          }]
        }
      });
      assert.equal(entity.constantFilters()[7].count, 80);
      assert.equal(entity.constantFilters()[7].name, 'advanced_circuit');
    });
    it('can output to an object', function () {
      const entity = new ConstantCombinatorEntity()
              .name('random-constant-compinator')
              .addConstantFilter('stone-wall', 15)
              .setConstantFilter(9, 'stone', 42)
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.filters[0].index, 1);
      assert.equal(obj.control_behavior.filters[0].signal.name, 'stone-wall');
//        assert.equal(obj.control_behavior.filters[0].signal.type, 'virtual');
      assert.equal(obj.control_behavior.filters[0].count, 15);
      assert.equal(obj.control_behavior.filters[1].index, 10);
      assert.equal(obj.control_behavior.filters[1].signal.name, 'stone');
//        assert.equal(obj.control_behavior.filters[1].signal.type, 'item');
      assert.equal(obj.control_behavior.filters[1].count, 42);
    });
  });
});


// vi: sts=2 ts=2 sw=2 et