const ConstantCombinator = (superclass) => class extends superclass {

    constantFilters(value) {
      return this._property('_constantFilters', value);
    }
    addConstantFilter(name, count) {
      if (typeof this._constantFilters === 'undefined') this._constantFilters = [];
      this._constantFilters.push({
        name: name,
        count: count
      });
      return this;
    }
    setConstantFilter(index, name, count) {
      if (typeof this._constantFilters === 'undefined') this._constantFilters = [];
      this._constantFilters[index] = {name: name, count: count};
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.filters) {
        this.constantFilters(
          obj.control_behavior.filters.reduce((acc, v) => {
                // -1 is to shift from a 1-indexed list to 0 indexed.
                acc[(+v.index) -1] = {name: v.signal.name.replace(/-/g, '_'), count: v.count};
                return acc;
              }, {})
        );
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          filters: Object.entries(this.constantFilters()).reduce((acc, v) => {
                acc.push({
                  signal: {type: 'item', name: v[1].name},
                  count: v[1].count,
                  index: (+v[0]) + 1
                });
                return acc;
              }, [])
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

module.exports = ConstantCombinator;
