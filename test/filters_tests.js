const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with filters', function () {
    const FilterEntity = mixwith.mix(entity.BaseEntity).with(entity.Filter);

    it('can get/set the filters property', function () {
      const entity = new FilterEntity();
      assert.equal(entity.filters({0: 'stone'}), entity); // setter returns the entity for function chaining.
      assert.equal(entity.filters()[0], 'stone');
    });
    it('can read from an input object', function () {
      const entity = new FilterEntity();
      entity.fromObject({
        filters: [
          {index: '1', name: 'iron-plate'}
        ]
      });
      assert.equal(entity.filters()[0], 'iron_plate');
    });
    it('can output to an object', function () {
      const entity = new FilterEntity()
              .name("foo")
              .filters({'4': 'steel-plate'})
              ;
      const obj = entity.toObject();
      assert.equal(obj.filters[0].index, 5);
      assert.equal(obj.filters[0].name, 'steel-plate');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et