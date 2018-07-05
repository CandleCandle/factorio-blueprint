const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with recipes', function () {
    const RecipeEntity = mixwith.mix(entity.BaseEntity).with(entity.Recipe);

    it('can get/set the recipe property', function () {
      const entity = new RecipeEntity();
      assert.equal(entity.recipe('rocket-control-unit'), entity); // setter returns the entity for function chaining.
      assert.equal(entity.recipe(), 'rocket-control-unit');
    });
    it('can read from an input object', function () {
      const entity = new RecipeEntity();
      entity.fromObject({
        recipe: 'beacon'
      });
      assert.equal(entity.recipe(), 'beacon');
    });
    it('can output to an object', function () {
      const entity = new RecipeEntity()
              .name("foo")
              .recipe('speed-module')
              ;
      const obj = entity.toObject();
      assert.equal(obj.recipe, 'speed-module');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et