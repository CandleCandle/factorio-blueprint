const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities that dispense robots', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const RoboEntity = mixwith.mix(entity.BaseEntity).with(entity.RoboPort);

    it('can read from an input object', function () {
      const entity = new RoboEntity();
      entity.fromObject({
        control_behavior: {
          circuit_mode_of_operation: 1
        }
      });
      assert.equal(entity.circuitModeOfOperation(), 1);
    });
    it('can output to an object', function () {
      const entity = new RoboEntity()
              .name('roboport')
              .circuitModeOfOperation(0) // 0: logistics network, 1: robot statistics ?
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.circuit_mode_of_operation, 0);
    });
    describe('utility functions', function () {
      it('transmits contents of the logistics network', function () {
        const entity = new RoboEntity()
                .name('roboport')
                .circuitModeOfOperationLogisticsNetwork()
                ;
        const obj = entity.toObject();
        assert.equal(obj.control_behavior.circuit_mode_of_operation, 0);
      });
      it('transmits the robot statistics', function () {
        const entity = new RoboEntity()
                .name('roboport')
                .circuitModeOfOperationRobotStatistics()
                ;
        const obj = entity.toObject();
        assert.equal(obj.control_behavior.circuit_mode_of_operation, 1);
      });
      it('output signals can be changed', function () {
        const entity = new RoboEntity()
                .name('roboport')
                .availableLogisticOutputSignal({name: 'signal-Q', type: 'virtual'})
                .totalLogisticOutputSignal({name: 'signal-W', type: 'virtual'})
                .availableConstructionOutputSignal({name: 'signal-E', type: 'virtual'})
                .totalConstructionOutputSignal({name: 'signal-R', type: 'virtual'})
                ;
        const obj = entity.toObject();
        assert.equal(obj.control_behavior.available_logistic_output_signal.name, 'signal-Q');
        assert.equal(obj.control_behavior.total_logistic_output_signal.name, 'signal-W');
        assert.equal(obj.control_behavior.available_construction_output_signal.name, 'signal-E');
        assert.equal(obj.control_behavior.total_construction_output_signal.name, 'signal-R');
      });
    })
  });
});


// vi: sts=2 ts=2 sw=2 et