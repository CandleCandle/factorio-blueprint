const RoboPort = (superclass) => class extends superclass {
    
    circuitModeOfOperation(circuitModeOfOperation) {
      return this._property('_circuitModeOfOperation', circuitModeOfOperation);
    }

    circuitModeOfOperationLogisticsNetwork() {
      return this.circuitModeOfOperation(0);
    }
    circuitModeOfOperationRobotStatistics() {
      return this.circuitModeOfOperation(1);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior) {
        const cb = obj.control_behavior;
        if (typeof cb.circuit_mode_of_operation !== 'undefined') this.circuitModeOfOperation(cb.circuit_mode_of_operation);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          circuit_mode_of_operation: this.circuitModeOfOperation()
        }
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
  };

module.exports = RoboPort;


// vi: sts=2 ts=2 sw=2 et
