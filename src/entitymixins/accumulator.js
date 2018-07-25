const Accumulator = (superclass) => class extends superclass {
    
    outputSignal(outputSignal) {
      return this._property('_outputSignal', outputSignal);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior) {
        const cb = obj.control_behavior;
        if (typeof cb.output_signal !== 'undefined') this.outputSignal(cb.output_signal);
      }
    }

    toObject() {
      const mine = {};
      if (typeof this.outputSignal() !== 'undefined') {
        mine.control_behavior = {};
        mine.control_behavior.output_signal = this.outputSignal();
      }

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
  };

module.exports = Accumulator;


// vi: sts=2 ts=2 sw=2 et
