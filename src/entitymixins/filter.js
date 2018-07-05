/**
 * filters: filter inserters & stack filter inserters both have a filters
 * section.
 */
const Filter = (superclass) => class extends superclass {
    // filters: object: {int: string}

    filters(filters) {
      return this._property('_filters', filters);
    }

    withFilter(index, type) {
      if (typeof this.filters() === 'undefined') this.filters({});
      this._filters[index] = type;
      return this;
    }

    addFilter(type) {
      // TODO find the next available slot for type; filling gaps as required
      this._filters[this._filters.size] = type;
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.filters) this.filters(
              obj.filters.reduce((acc, v) => {
                // -1 is to shift from a 1-indexed list to 0 indexed.
                acc[(+v.index) -1] = v.name.replace(/-/g, '_');
                return acc;
              }, {})

            );
    }

    toObject() {
      const mine = {
        filters: Object.entries(this.filters())
                .map(e => {
                  // +1 is to shift from a 0-indexed list to a 1-indexed list.
                  return {index: (+e[0]) + 1, name: e[1].replace(/_/g, '-')};
                })
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Filter;
