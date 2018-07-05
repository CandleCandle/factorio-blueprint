const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');


describe('Entity Features', function () {
  describe('decider combinators', function() {
    const DeciderCombinatorEntity = mixwith.mix(entity.BaseEntity).with(entity.DeciderCombinator);
    it('can read from an input object', function () {
      const entity = new DeciderCombinatorEntity();
      entity.fromObject({
        control_behavior: {
          decider_conditions: {
            first_signal: {type: 'item', name: 'medium-electric-pole'},
            constant: 42,
            comparator: '>'
          }
        }
      });
      assert.equal(entity.deciderConditionFirstSignal().name, 'medium-electric-pole');
      assert.equal(entity.deciderConditionComparator(), '>');
      assert.equal(entity.deciderConditionConstant(), 42);
    });
    it('can output to an object', function () {
      const entity = new DeciderCombinatorEntity()
              .name('random-decider-compinator')
              .deciderConditionFirstSignal({name: 'signal-A', type: 'virtual'})
              .deciderConditionComparator('<')
              .deciderConditionConstant(9)
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.decider_conditions.first_signal.name, 'signal-A');
      assert.equal(obj.control_behavior.decider_conditions.first_signal.type, 'virtual');
      assert.equal(obj.control_behavior.decider_conditions.constant, 9);
      assert.equal(obj.control_behavior.decider_conditions.comparator, '<');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et