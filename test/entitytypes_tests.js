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
  describe('entities with positions', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const PositionEntity = mixwith.mix(entity.BaseEntity).with(entity.Position);

    it('can get/set the position property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.position(new Victor(5, -2)), entity);
      assert.deepStrictEqual(entity.position(), new Victor(5,-2));
    });
    it('can get/set the x property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.x(4), entity);
      assert.equal(entity.x(), 4);
      assert.equal(entity.y(), 0); // default for when only one of x/y is set.
    });
    it('can get/set the y property', function () {
      const entity = new PositionEntity().name('stone-wall');
      assert.equal(entity.name('stone-wall'), entity);
      assert.equal(entity.y(9), entity);
      assert.equal(entity.y(), 9);
      assert.equal(entity.x(), 0); // default for when only one of x/y is set.
    });
    it('can read from an input object', function () {
      const entity = new PositionEntity();
      entity.fromObject({
        name: 'stone-wall',
        position: {x: 5, y: 42}
      });
      assert.equal(entity.name(), 'stone-wall');
      assert.equal(entity.position().x, 5);
      assert.equal(entity.position().y, 42);
      assert.equal(entity.x(), 5);
      assert.equal(entity.y(), 42);
    });
    it('can output to an object', function () {
      const entity = new PositionEntity().name('stone-wall')
              .x(4)
              .y(7)
              ;
      const obj = entity.toObject();
      assert.equal(obj.name, 'stone-wall');
      assert.equal(obj.position.x, 4);
      assert.equal(obj.position.y, 7);
    });
  });

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