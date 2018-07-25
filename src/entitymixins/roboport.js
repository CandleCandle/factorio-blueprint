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

    availableLogisticOutputSignal(availableLogisticOutputSignal) {
      return this._property('_availableLogisticOutputSignal', availableLogisticOutputSignal);
    }
    totalLogisticOutputSignal(totalLogisticOutputSignal) {
      return this._property('_totalLogisticOutputSignal', totalLogisticOutputSignal);
    }
    availableConstructionOutputSignal(availableConstructionOutputSignal) {
      return this._property('_availableConstructionOutputSignal', availableConstructionOutputSignal);
    }
    totalConstructionOutputSignal(totalConstructionOutputSignal) {
      return this._property('_totalConstructionOutputSignal', totalConstructionOutputSignal);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior) {
        const cb = obj.control_behavior;
        if (typeof cb.circuit_mode_of_operation !== 'undefined') this.circuitModeOfOperation(cb.circuit_mode_of_operation);
        if (typeof cb.available_logistic_output_signal !== 'undefined') this.availableLogisticOutputSignal(cb.available_logistic_output_signal);
        if (typeof cb.total_logistic_output_signal !== 'undefined') this.totalLogisticOutputSignal(cb.total_logistic_output_signal);
        if (typeof cb.available_construction_output_signal !== 'undefined') this.availableConstructionOutputSignal(cb.available_construction_output_signal);
        if (typeof cb.total_construction_output_signal !== 'undefined') this.totalConstructionOutputSignal(cb.total_construction_output_signal);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          circuit_mode_of_operation: this.circuitModeOfOperation()
        }
      };
      if (this.availableLogisticOutputSignal()) mine.control_behavior.available_logistic_output_signal = this.availableLogisticOutputSignal();
      if (this.totalLogisticOutputSignal()) mine.control_behavior.total_logistic_output_signal = this.totalLogisticOutputSignal();
      if (this.availableLogisticOutputSignal()) mine.control_behavior.available_construction_output_signal = this.availableConstructionOutputSignal();
      if (this.totalConstructionOutputSignal()) mine.control_behavior.total_construction_output_signal = this.totalConstructionOutputSignal();

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
