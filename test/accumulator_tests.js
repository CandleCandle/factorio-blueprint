const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities that store power', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const AccEntity = mixwith.mix(entity.BaseEntity).with(entity.Accumulator);

    it('can read from an input object', function () {
      const entity = new AccEntity();
      entity.fromObject({
        control_behavior: {
          output_signal: {type: 'virtual', name: 'signal-P'}
        }
      });
      assert.equal(entity.outputSignal().name, 'signal-P');
      assert.equal(entity.outputSignal().type, 'virtual');
    });
    it('can output to an object', function () {
      const entity = new AccEntity()
              .name('accumulator')
              .outputSignal({type: 'virtual', name: 'signal-Q'})
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.output_signal.name, 'signal-Q');
      assert.equal(obj.control_behavior.output_signal.type, 'virtual');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et