"use strict";

const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');

describe('Entity Features', function () {
  describe('base entity', function () {
    // using the mixin structure to ensure that it is tested through the pattern that is used in reality.
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const BaseEntity = mixwith.mix(entity.BaseEntity).with();

    it('can get/set the name property', function () {
      const entity = new BaseEntity();
      assert.equal(entity.name('stone-wall'), entity); // setter returns the entity for function chaining.
      assert.equal(entity.name(), 'stone-wall');
    });
    it('can get/set the entity number property', function () {
      const entity = new BaseEntity();
      assert.equal(entity.number(1), entity); // setter returns the entity for function chaining.
      assert.equal(entity.number(), 1);
    });
    it('can read from an input object', function () {
      const entity = new BaseEntity();
      entity.fromObject({
        name: 'concrete',
        entity_number: 1
      });
      assert.equal(entity.name(), 'concrete');
      assert.equal(entity.number(), 1);
    });
    it('can output to an object', function () {
      const entity = new BaseEntity().name('beacon').number(4);
      const obj = entity.toObject();
      assert.equal(obj.name, 'beacon');
      assert.equal(obj.entity_number, 4);
    });
  });

});

// vi: sts=2 ts=2 sw=2 et