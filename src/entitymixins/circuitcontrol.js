const CircuitControl = (superclass) => class extends superclass {

    circuitControlFirstSignal(name, type) {
      if (typeof name !== 'undefined' && typeof type !== 'undefined') {
        var obj = {name: name, type: type};
      }
      return this._property('_circuitControlFirstSignal', obj);
    }

    circuitControlSecondSignal(name, type) {
      if (typeof name !== 'undefined' && typeof type !== 'undefined') {
        var obj = {name: name, type: type};
      }
      return this._property('_circuitControlSecondSignal', obj);
    }

    circuitControlConstant(value) {
      return this._property('_circuitControlConstant', value);
    }

    circuitControlComparator(value) {
      return this._property('_circuitControlComparator', value);
    }

    circuitControlEnabled(value) {
      return this._property('_circuitControlEnabled', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.circuit_condition) {
        const cc = obj.control_behavior.circuit_condition;
        if (obj.control_behavior.circuit_enable_disable) this.circuitControlEnabled(obj.control_behavior.circuit_enable_disable);
        if (cc.first_signal) this.circuitControlFirstSignal(cc.first_signal.name, cc.first_signal.type);
        if (cc.second_signal) this.circuitControlSecondSignal(cc.second_signal.name, cc.second_signal.type);
        if (cc.constant) this.circuitControlConstant(cc.constant);
        if (cc.comparator) this.circuitControlComparator(cc.comparator);
      }
    }


    toObject() {
      const mine = {
        control_behavior: {
          circuit_enable_disable: this.circuitControlEnabled(),
          circuit_condition: {
            first_signal: this.circuitControlFirstSignal(),
            comparator: this.circuitControlComparator(),

            constant: this.circuitControlConstant(),
            second_signal: this.circuitControlSecondSignal()
          }
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

module.exports = CircuitControl;
