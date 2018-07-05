const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');


describe('Entity Features', function () {
  describe('arithmethic combinators', function() {
    const ArithmeticCombinatorEntity = mixwith.mix(entity.BaseEntity).with(entity.ArithmeticCombinator);
    it('can read from an input object', function () {
      const entity = new ArithmeticCombinatorEntity();
      entity.fromObject({
        control_behavior: {
          arithmetic_conditions: {
            first_signal: {type: 'item', name: 'big-electric-pole'},
            second_constant: 1,
            operation: '*',
            output_signal: {type: 'virtual', name: 'signal-C'}
          }
        }
      });
      assert.equal(entity.arithmeticConditionFirstSignal().name, 'big-electric-pole');
      assert.equal(entity.arithmeticConditionOperation(), '*');
      assert.equal(entity.arithmeticConditionSecondConstant(), 1);
      assert.equal(entity.arithmeticConditionOutputSignal().name, 'signal-C');
    });
    it('can output to an object', function () {
      const entity = new ArithmeticCombinatorEntity()
              .name('random-arithmetic-compinator')
              .arithmeticConditionFirstSignal({name: 'signal-A', type: 'virtual'})
              .arithmeticConditionOperation('+')
              .arithmeticConditionSecondSignal({name: 'signal-B', type: 'virtual'})
              .arithmeticConditionOutputSignal({name: 'signal-C', type: 'virtual'})
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.arithmetic_conditions.first_signal.name, 'signal-A');
      assert.equal(obj.control_behavior.arithmetic_conditions.first_signal.type, 'virtual');
      assert.equal(obj.control_behavior.arithmetic_conditions.operation, '+');
      assert.equal(obj.control_behavior.arithmetic_conditions.second_signal.name, 'signal-B');
      assert.equal(obj.control_behavior.arithmetic_conditions.second_signal.type, 'virtual');
      assert.equal(obj.control_behavior.arithmetic_conditions.output_signal.name, 'signal-C');
      assert.equal(obj.control_behavior.arithmetic_conditions.output_signal.type, 'virtual');
    });
  });
});

// vi: sts=2 ts=2 sw=2 et