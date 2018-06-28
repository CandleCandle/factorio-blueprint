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
  describe('entities with positions', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const PositionEntity = mixwith.mix(entity.BaseEntity).with(entity.Position);
    const PositionDirectionEntity = mixwith.mix(entity.BaseEntity).with(entity.Direction, entity.Position);

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
              .width(1).height(1) // normally set when the entity is created, from the static entitydata.
              .x(4)
              .y(7)
              ;
      const obj = entity.toObject();
      console.log("entity: ", entity);
      console.log("obj: ", obj);
      assert.equal(obj.name, 'stone-wall');
      assert.equal(obj.position.x, 4);
      assert.equal(obj.position.y, 7);
    });
    it('can output non-square entities to an object', function () {
      const entity = new PositionDirectionEntity().name('boiler')
              .x(4).y(7).direction(2)
              .width(3).height(2) // normally set when the entity is created, from the static entitydata.
              ;
      const obj = entity.toObject();
      assert.equal(obj.name, 'boiler');
      // add 1/2 the size, then subtract 0.5, 0.5.
      assert.equal(obj.position.x, 4.5);
      assert.equal(obj.position.y, 8);
    });

    describe('tileDataAction', function () {
      // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
      it('performs an action for all tiles for a 1x1 square entity', function () {
        const entity = new PositionEntity();
        entity.fromObject({
          name: 'stone-wall',
          width: 1,
          height: 1,
          position: {x: 5, y: 42}
        });
        const visited = {};
        entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
        assert.equal(visited["5,42"], 1);
      });
      it('performs an action for all tiles for a 2x2 square entity', function () {
        const entity = new PositionEntity();
        entity.fromObject({
          name: 'stone-wall',
          width: 2,
          height: 2,
          position: {x: 0.5, y: 0.5}
        });
        const visited = {};
        entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
        assert.equal(visited["0,0"], 1);
        assert.equal(visited["1,0"], 1);
        assert.equal(visited["0,1"], 1);
        assert.equal(visited["1,1"], 1);
      });
      describe('tileDataAction for non-square, rotated entities', function () {
        const coords = {
          0: {x: 1, y: 0.5},
          4: {x: 1, y: 0.5},
          2: {x: 0.5, y: 1},
          6: {x: 0.5, y: 1}
        };
        for (let rotation = 0; rotation <= 6; rotation += 2) {
          it('performs an action for all tiles for a rotated 3x2 square entity (rotation ' + rotation + ')', function () {
            const entity = new PositionDirectionEntity();
            entity.fromObject({
              name: 'heat_exchanger',
              width: 3,
              height: 2,
              direction: rotation,
              position: coords[rotation]
            });
            const visited = {};
            entity.tileDataAction((x,y) => visited[x + "," + y] = 1);
            if (rotation === 0 || rotation === 4) {
              assert.equal(visited["0,0"], 1);
              assert.equal(visited["0,1"], 1);
              assert.equal(visited["1,0"], 1);
              assert.equal(visited["1,1"], 1);
              assert.equal(visited["2,0"], 1);
              assert.equal(visited["2,1"], 1);
            } else {
              assert.equal(visited["0,0"], 1);
              assert.equal(visited["0,1"], 1);
              assert.equal(visited["0,2"], 1);
              assert.equal(visited["1,0"], 1);
              assert.equal(visited["1,1"], 1);
              assert.equal(visited["1,2"], 1);
            }
          });
        }
      });
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
    it('can get/set the second signal property', function () {
      const entity = new ControlEntity();
      assert.equal(entity.circuitControlSecondSignal('stone-wall', 'item'), entity); // setter returns the entity for function chaining.
      assert.equal(entity.circuitControlSecondSignal().name, 'stone-wall');
      assert.equal(entity.circuitControlSecondSignal().type, 'item');
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
        assert.equal(typeof obj.control_behavior.circuit_condition.second_signal, 'undefined'); // most have either a second_signal or a constant
      });
    });
    describe('signal <comparator> signal', function () {
      it('can read from an input object', function () {
        const entity = new ControlEntity();
        entity.fromObject({
          circuit_condition: {
            first_signal: { type: 'item', name: 'electronic-circuit' },
            second_signal: { type: 'item', name: 'wood' },
            comparator: '='
          }
        });
        assert.equal(entity.circuitControlFirstSignal().type, 'item');
        assert.equal(entity.circuitControlFirstSignal().name, 'electronic-circuit');
        assert.equal(entity.circuitControlSecondSignal().type, 'item');
        assert.equal(entity.circuitControlSecondSignal().name, 'wood');
        assert.equal(entity.circuitControlComparator(), '=');
      });
      it('can output to an object', function () {
        const entity = new ControlEntity()
                .circuitControlFirstSignal('wood', 'item')
                .circuitControlComparator('<')
                .circuitControlSecondSignal('stone-wall', 'item')
                ;
        const obj = entity.toObject();
        assert.equal(obj.control_behavior.circuit_condition.first_signal.name, 'wood');
        assert.equal(obj.control_behavior.circuit_condition.first_signal.type, 'item');
        assert.equal(obj.control_behavior.circuit_condition.second_signal.name, 'stone-wall');
        assert.equal(obj.control_behavior.circuit_condition.second_signal.type, 'item');
        assert.equal(obj.control_behavior.circuit_condition.comparator, '<');
        assert.equal(typeof obj.control_behavior.circuit_condition.constant, 'undefined'); // most have either a second_signal or a constant
      });
    });
  });

  describe('connections', function () {
    const ConnectionsEntity = mixwith.mix(entity.BaseEntity).with(entity.Connections);

    // Connections require a double-pass of the data;
    // first call fromObject to get the entity objects; then for each entity
    // call updateConnections passing in an object of entity_number => entity
    // mappings.
    it('can read from an input object', function () {
      const entity1 = new ConnectionsEntity();
      entity1.fromObject({
        name: 'medium-electric-pole',
        entity_number: 1,
        connections: {
          '1': {
            red: [
              { entity_id: 2 }
            ]
          }
        }
      });
      const entity2 = new ConnectionsEntity();
      entity2.fromObject({
        name: 'medium-electric-pole',
        entity_number: 2,
        connections: {
          '1': {
            red: [
              { entity_id: 1 }
            ]
          }
        }
      });
      const entityNumberMap = {
        1: entity1,
        2: entity2
      };
      entity1.updateConnections(entityNumberMap);
      entity2.updateConnections(entityNumberMap);

      assert.equal(entity1.name(), 'medium-electric-pole');
      assert.equal(entity1.number(), 1);
      assert.equal(entity2.name(), 'medium-electric-pole');
      assert.equal(entity2.number(), 2);

      assert.equal(entity1.connections().get('1', 'red')[0].otherEntity, entity2);
      assert.equal(entity2.connections().get('1', 'red')[0].otherEntity, entity1);
    });

    it('can connect two entities', function () {
      const entity1 = new ConnectionsEntity()
              .name('medium-electric-pole');
      const entity2 = new ConnectionsEntity()
              .name('power-switch');
      const mySide = '1';
      const theirSide = '1';
      entity1.connectTo(entity2, mySide, theirSide, 'green');

      assert.equal(entity1.connections().get('1', 'green')[0].otherEntity, entity2);
      assert.equal(entity2.connections().get('1', 'green')[0].otherEntity, entity1);
    });

    it('toObject renders both side of the connection', function () {
      // (re)numbering should be done by the blueprint container before rendering.
      const entity1 = new ConnectionsEntity()
              .number(1)
              .name('medium-electric-pole');
      const entity2 = new ConnectionsEntity()
              .number(2)
              .name('power-switch');
      const mySide = '1';
      const theirSide = '1';
      entity1.connectTo(entity2, mySide, theirSide, 'green');


      const obj1 = entity1.toObject();
      assert.equal(obj1.connections['1'].green[0].entity_id, 2);
      const obj2 = entity2.toObject();
      assert.equal(obj2.connections['1'].green[0].entity_id, 1);
    });

    it('can read copper connections from an input object', function () {
      const entity1 = new ConnectionsEntity();
      entity1.fromObject({
        name: 'medium-electric-pole',
        entity_number: 1,
        connections: {}
      });
      const entity2 = new ConnectionsEntity();
      entity2.fromObject({
        name: 'power-switch',
        entity_number: 2,
        connections: {
          'Cu0': [
            { entity_id: 1, wire_id: 0 }
          ],
          'Cu1': [
            { entity_id: 3, wire_id: 0 }
          ]
        }
      });
      const entity3 = new ConnectionsEntity();
      entity3.fromObject({
        name: 'medium-electric-pole',
        entity_number: 3,
        connections: {}
      });
      const entityNumberMap = {
        1: entity1,
        2: entity2,
        3: entity3
      };
      entity1.updateConnections(entityNumberMap);
      entity2.updateConnections(entityNumberMap);
      entity2.updateConnections(entityNumberMap);

      assert.equal(entity1.name(), 'medium-electric-pole');
      assert.equal(entity1.number(), 1);
      assert.equal(entity2.name(), 'power-switch');
      assert.equal(entity2.number(), 2);
      assert.equal(entity3.name(), 'medium-electric-pole');
      assert.equal(entity3.number(), 3);

      assert.equal(entity2.connections().get('Cu0')[0].otherEntity, entity1);
      assert.equal(entity2.connections().get('Cu1')[0].otherEntity, entity3);
    });

    it('can render copper connections', function () {
      // (re)numbering should be done by the blueprint container before rendering.
      const entity1 = new ConnectionsEntity()
              .number(1)
              .name('medium-electric-pole');
      const entity2 = new ConnectionsEntity()
              .number(2)
              .name('power-switch');
      const mySide = 'Cu0';
      entity2.connectTo(entity1, mySide);


      const obj2 = entity2.toObject();
      assert.equal(obj2.connections['Cu0'][0].entity_id, 1);
      const obj1 = entity1.toObject();
      assert.equal(typeof obj1.connections['Cu0'], 'undefined'); // only the power-switch side of the connection seems to be rendered.
    });
    it('can render multiple connections from the same entity', function () {
      // (re)numbering should be done by the blueprint container before rendering.
      const entity = new ConnectionsEntity()
              .number(1)
              .name('medium-electric-pole');
      const others = [];
      for (let i = 2; i < 12; ++i) {
        const o = new ConnectionsEntity()
                  .number(i)
                  .name('medium-electric-pole');
        o.connectTo(entity, '1', '1', 'red');
        others.push(o);
      }

      const obj2 = entity.toObject();
      assert.equal(obj2.connections['1']['red'].length, 10);
    });
    it('can render connections to different sides', function () {
      // (re)numbering should be done by the blueprint container before rendering.
      const entity = new ConnectionsEntity()
              .number(1)
              .name('medium-electric-pole');
      const combinator = new ConnectionsEntity()
              .number(2)
              .name('arithmetic-combinator');
      combinator.connectTo(entity, '1', '1', 'red');
      combinator.connectTo(entity, '2', '1', 'red');
      combinator.connectTo(entity, '2', '1', 'green');

      const obj = combinator.toObject();
      assert.equal(obj.connections['1']['red'][0].entity_id, 1);
      assert.equal(obj.connections['2']['red'][0].entity_id, 1);
      assert.equal(obj.connections['2']['green'][0].entity_id, 1);
    });
  });
});

describe('entity mixins', function () {
  describe('', function () {
    it('can do filter inserters', function () {
      const FilterInserter = mixwith.mix(entity.BaseEntity).with(entity.Position, entity.Direction, entity.Filter);
      const fi = new FilterInserter()
              .name("filter-inserter")
              .width(1).height(1) // normally set when the entity is created, from the static entitydata.
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