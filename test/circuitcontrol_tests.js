const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
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
          name: "something",
          control_behavior: {
            circuit_enable_disable: true,
            circuit_condition: {
              first_signal: { type: 'item', name: 'electronic-circuit' },
              constant: 40,
              comparator: '>'
            }
          }
        });
        assert.equal(entity.circuitControlEnabled(), true);
        assert.equal(entity.circuitControlFirstSignal().type, 'item');
        assert.equal(entity.circuitControlFirstSignal().name, 'electronic-circuit');
        assert.equal(entity.circuitControlConstant(), 40);
        assert.equal(entity.circuitControlComparator(), '>');
      });
      it('can output to an object', function () {
        const entity = new ControlEntity()
                .name("something")
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
          control_behavior: {
            circuit_condition: {
              first_signal: { type: 'item', name: 'electronic-circuit' },
              second_signal: { type: 'item', name: 'wood' },
              comparator: '='
            }
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
                .name("foo")
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
});


// vi: sts=2 ts=2 sw=2 et