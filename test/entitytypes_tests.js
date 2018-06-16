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
      assert.equal(entity.modules()['speed-module'], 1);
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
              .recipe('speed-module')
              ;
      const obj = entity.toObject();
      assert.equal(obj.recipe, 'speed-module');
    });
  });

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
        filters: {
          '1': 'iron-plate'
        }
      });
      assert.equal(entity.filters()[1], 'iron-plate');
    });
    it('can output to an object', function () {
      const entity = new FilterEntity()
              .filters({'4': 'steel-plate'})
              ;
      const obj = entity.toObject();
      assert.equal(obj.filters['4'], 'steel-plate');
    });
  });

  describe('entities with circuit control', function () {
    const ControlEntity = mixwith.mix(entity.BaseEntity).with(entity.CircuitControl);

    it('can get/set the first signal property', function () {
      const entity = new ControlEntity();
      assert.equal(entity.circuitControlFirstSignal('stone', 'item'), entity); // setter returns the entity for function chaining.
      assert.equal(entity.circuitControlFirstSignal().name, 'stone');
      assert.equal(entity.circuitControlFirstSignal().type, 'item');
    });
    it('can get/set the constant property', function () {
      const entity = new ControlEntity();
      assert.equal(entity.circuitControlConstant(34), entity); // setter returns the entity for function chaining.
      assert.equal(entity.circuitControlConstant(), 34);
    });
    it('can get/set the comparator property', function () {
      const entity = new ControlEntity();
      assert.equal(entity.circuitControlComparator('='), entity); // setter returns the entity for function chaining.
      assert.equal(entity.circuitControlComparator(), '=');
    });

    describe('signal <comparator> constant', function () {
      it('can read from an input object', function () {
        const entity = new ControlEntity();
        entity.fromObject({
          circuit_condition: {
            first_signal: { type: 'item', name: 'electronic-circuit' },
            constant: 40,
            comparator: '>'
          }
        });
        assert.equal(entity.circuitControlFirstSignal().type, 'item');
        assert.equal(entity.circuitControlFirstSignal().name, 'electronic-circuit');
        assert.equal(entity.circuitControlConstant(), 40);
        assert.equal(entity.circuitControlComparator(), '>');
      });
      it('can output to an object', function () {
        const entity = new ControlEntity()
                .circuitControlFirstSignal('wood', 'item')
                .circuitControlConstant(42)
                .circuitControlComparator('>')
                ;
        const obj = entity.toObject();
        assert.equal(obj.control_behavior.circuit_condition.first_signal.name, 'wood');
        assert.equal(obj.control_behavior.circuit_condition.first_signal.type, 'item');
        assert.equal(obj.control_behavior.circuit_condition.constant, 42);
        assert.equal(obj.control_behavior.circuit_condition.comparator, '>');
      });
    });
  });

  // TODO: Connections - will require a double-pass of the data.
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
//      console.log("obj:", obj);

      assert.equal(obj.name, 'filter-inserter');
      assert.equal(obj.position.x, 4);
      assert.equal(obj.position.y, 5);
      assert.equal(obj.direction, 6);
      assert.equal(obj.filters["0"], 'stone');

    });
  });
});

// vi: sts=2 ts=2 sw=2 et