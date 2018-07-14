const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities that have ore extraction properties', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const MiningEntity = mixwith.mix(entity.BaseEntity).with(entity.MiningDrill);

    it('can read from an input object', function () {
      const entity = new MiningEntity();
      entity.fromObject({
        control_behavior: {
          circuit_read_resources: true,
          circuit_resource_read_mode: 1
        }
      });
      assert.equal(entity.circuitReadResources(), true);
      assert.equal(entity.circuitReadResourcesMode(), 1);
    });
    it('can output to an object', function () {
      const entity = new MiningEntity()
              .name('underground-belt')
              .circuitReadResources(true)
              .circuitReadResourcesMode(2) // 1="this miner" 2="whole ore patch"
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.circuit_read_resources, true);
      assert.equal(obj.control_behavior.circuit_resource_read_mode, 2);
    });
  });
});


// vi: sts=2 ts=2 sw=2 et