const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with inventories', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const InventoryEntity = mixwith.mix(entity.BaseEntity).with(entity.Inventory);

    it('can get/set the bar property', function () {
      const entity = new InventoryEntity();
      assert.equal(entity.bar(6), entity); // setter returns the entity for function chaining.
      assert.equal(entity.bar(), 6);
    });
    it('can read from an input object', function () {
      const entity = new InventoryEntity();
      entity.fromObject({
        maxInventory: 9,
        bar: 4
      });
      assert.equal(entity.bar(), 4);
      assert.equal(entity.maxInventory(), 9);
    });
    it('can read from an input object - where there is no bar', function () {
      const entity = new InventoryEntity();
      entity.fromObject({
        maxInventory: 9
      });
      assert.equal(entity.bar(), -1);
      assert.equal(entity.maxInventory(), 9);
    });
    it('can output to an object', function () {
      const entity = new InventoryEntity()
              .name('stone-wall')
              .bar(2)
              .maxInventory(84)
              ;
      const obj = entity.toObject();
      assert.equal(obj.bar, 2);
      assert.equal(typeof obj.maxInventory, 'undefined'); // maxInventory comes from our entityData and therefore should not be exported
    });
  });
});


// vi: sts=2 ts=2 sw=2 et