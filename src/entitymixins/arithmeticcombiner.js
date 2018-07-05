const ArithmeticCombinator = (superclass) => class extends superclass {

    arithmeticConditionFirstSignal(value) {
      return this._property('_arithmeticConditionFirstSignal', value);
    }

    arithmeticConditionOperation(value) {
      return this._property('_arithmeticConditionOperation', value);
    }

    arithmeticConditionSecondConstant(value) {
      return this._property('_arithmeticConditionSecondConstant', value);
    }

    arithmeticConditionSecondSignal(value) {
      return this._property('_arithmeticConditionSecondSignal', value);
    }

    arithmeticConditionOutputSignal(value) {
      return this._property('_arithmeticConditionOutputSignal', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.arithmetic_conditions) {
        // <output_signal> = <first_signal> <operator> {<second_constant> XOR <second_signal>}
        const ac = obj.control_behavior.arithmetic_conditions;
        if (ac.first_signal) this.arithmeticConditionFirstSignal(ac.first_signal);
        if (ac.second_constant) this.arithmeticConditionSecondConstant(ac.second_constant);
        if (ac.second_signal) this.arithmeticConditionSecondSignal(ac.second_signal);
        if (ac.operation) this.arithmeticConditionOperation(ac.operation);
        if (ac.output_signal) this.arithmeticConditionOutputSignal(ac.output_signal);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          arithmetic_conditions: {
            first_signal: this.arithmeticConditionFirstSignal(),

            operation: this.arithmeticConditionOperation(),

            second_signal: this.arithmeticConditionSecondSignal(),
            second_constant: this.arithmeticConditionSecondConstant(),

            output_signal: this.arithmeticConditionOutputSignal()
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

module.exports = ArithmeticCombinator;