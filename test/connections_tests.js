const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
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


// vi: sts=2 ts=2 sw=2 et