const DeciderCombinator = (superclass) => class extends superclass {

    deciderConditionFirstSignal(value) {
      return this._property('_deciderConditionFirstSignal', value);
    }

    deciderConditionComparator(value) {
      return this._property('_deciderConditionComparator', value);
    }

    deciderConditionConstant(value) {
      return this._property('_deciderConditionConstant', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.decider_conditions) {
        // <output_signal> = <first_signal> <operator> {<second_constant> XOR <second_signal>}
        const dc = obj.control_behavior.decider_conditions;
        if (dc.first_signal) this.deciderConditionFirstSignal(dc.first_signal);
        if (dc.comparator) this.deciderConditionComparator(dc.comparator);
        if (dc.constant) this.deciderConditionConstant(dc.constant);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          decider_conditions: {
            first_signal: this.deciderConditionFirstSignal(),
            comparator: this.deciderConditionComparator(),
            constant: this.deciderConditionConstant()
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

module.exports = DeciderCombinator;

// vi: sts=2 ts=2 sw=2 et

