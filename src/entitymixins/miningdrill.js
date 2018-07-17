const MiningDrill = (superclass) => class extends superclass {
    
    circuitReadResources(circuitReadResources) {
      return this._property('_circuitReadResources', circuitReadResources);
    }
    circuitReadResourcesMode(circuitReadResourcesMode) {
      return this._property('_circuitReadResourcesMode', circuitReadResourcesMode);
    }
    circuitReadResourcesReadEntirePatch() {
      this.circuitReadResources(true);
      this.circuitReadResourcesMode(1);
      return this;
    }
    circuitReadResourcesReadThisMiner() {
      this.circuitReadResources(true);
      this.circuitReadResourcesMode(0);
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior) {
        const cb = obj.control_behavior;
        if (typeof cb.circuit_read_resources !== 'undefined') this.circuitReadResources(cb.circuit_read_resources);
        if (typeof cb.circuit_resource_read_mode !== 'undefined') this.circuitReadResourcesMode(cb.circuit_resource_read_mode);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          circuit_read_resources: this.circuitReadResources(),
          circuit_resource_read_mode: this.circuitReadResourcesMode()
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

module.exports = MiningDrill;


// vi: sts=2 ts=2 sw=2 et
