const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with modules', function () {
    const ModuleEntity = mixwith.mix(entity.BaseEntity).with(entity.Modules);

    it('can get/set the items property', function () {
      const entity = new ModuleEntity();
      assert.equal(entity.modules({'speed-module': 1}), entity); // setter returns the entity for function chaining.
      assert.equal(entity.modules()['speed-module'], 1);
    });

    // TODO test first for utility functions that can add/remove modules; checking maxModules in the process.

    it('can read from an input object', function () {
      const entity = new ModuleEntity();
      entity.fromObject({
        name: 'beacon',
        modules: 2,
        items: {'speed-module': 1}
      });
      assert.equal(entity.modules()['speed_module'], 1); // XXX the key here should be 'speed-module'; but needs to have the underscore to maintain compatibility.
      assert.equal(entity.maxModules(), 2);
    });
    it('can output to an object', function () {
      const entity = new ModuleEntity()
              .name('stone-wall')
              .modules({'speed-module': 1})
              .maxModules(9001)
              ;
      const obj = entity.toObject();
      assert.equal(obj.items['speed-module'], 1);
      assert.equal(typeof obj.maxModules, 'undefined'); // maxModules comes from our entityData and therefore should not be exported
    });
  });
});


// vi: sts=2 ts=2 sw=2 et