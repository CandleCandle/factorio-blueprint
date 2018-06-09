"use strict";

const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');

/*
 *
 * Parsing tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('Entity Features', function () {
  describe('base entity', function () {
    // using the mixin structure to ensure that it is tested through the pattern that is used in reality.
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const BaseEntity = mixwith.mix(entity.BaseEntity).with();

    it('can get/set the name property', function () {
      const entity = new BaseEntity().name('stone-wall');
      assert.equal(entity.name(), 'stone-wall');
      assert.equal(entity.name('stone-wall'), entity); // setter returns the entity for function chaining.
    });
    it('can read from an input object', function () {
      const entity = new BaseEntity();
      entity.fromObject({name: 'concrete'});
      assert.equal(entity.name(), 'concrete');
    });
    it('can output to an object', function () {
      const entity = new BaseEntity().name('beacon');
      const obj = entity.toObject();

      assert.equal(obj.name, 'beacon');
    });
  });
});

describe('entity mixins', function () {
  describe('', function () {
    it('can do filter inserters', function () {
      const FilterInserter = mixwith.mix(entity.BaseEntity).with(entity.Position, entity.Direction, entity.Filter);
      const fi = new FilterInserter()
              .name("filter-inserter")
              .x(4).y(5)
              .direction(6)
              .filters({0: "stone"})
              ;
//        console.log("filter inserter class: ", FilterInserter);

      const obj = fi.toObject();
      console.log("obj:", obj);

      assert.equal(obj.name, 'filter-inserter');
      assert.equal(obj.position.x, 4);
      assert.equal(obj.position.y, 5);
      assert.equal(obj.direction, 6);
      assert.equal(obj.filters["0"], 'stone');

    });
  });
});

// vi: sts=2 ts=2 sw=2 et