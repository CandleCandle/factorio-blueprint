const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('logistic filters', function() {
    const LogisticFilterEntity = mixwith.mix(entity.BaseEntity).with(entity.LogisticFilter);
    it('can read from an input object', function () {
      const entity = new LogisticFilterEntity();
      entity.fromObject({
        request_filters: [
          {index: '1', name: 'iron-plate', count: 400},
          {index: '7', name: 'steel-plate', count: 100}
        ]
      });
      assert.equal(entity.logisticFilters()[0].name, 'iron_plate');
      assert.equal(entity.logisticFilters()[0].count, 400);
      assert.equal(entity.logisticFilters()[6].name, 'steel_plate');
      assert.equal(entity.logisticFilters()[6].count, 100);
    });
    it('can output to an object', function () {
      const entity = new LogisticFilterEntity()
              .name("foo")
              .withLogisticFilter(4, 'steel-plate', 42)
              ;
      const obj = entity.toObject();
      assert.equal(obj.request_filters[0].index, 5);
      assert.equal(obj.request_filters[0].name, 'steel-plate');
      assert.equal(obj.request_filters[0].count, 42);
    });
  });

});


// vi: sts=2 ts=2 sw=2 et