/**
 * logistic filters: buffer and requester chests have type/quantity pairs.
 * section.
 */
const LogisticFilter = (superclass) => class extends superclass {
    // filters: object: {int: string}

    logisticFilters(filters) {
      return this._property('_logisticFilters', filters);
    }

    withLogisticFilter(index, type, count) {
      if (typeof this.logisticFilters() === 'undefined') this.logisticFilters([]);
      this._logisticFilters[index] = {name: type, count: count};
      return this;
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.request_filters) this.logisticFilters(
              obj.request_filters.reduce((acc, v) => {
                // -1 is to shift from a 1-indexed list to 0 indexed.
                acc[(+v.index) -1] = {name: v.name.replace(/-/g, '_'), count: v.count};
                return acc;
              }, {})
            );
    }

    toObject() {
      const mine = {};
      if (this.logisticFilters()) {
        mine.request_filters = Object.entries(this.logisticFilters())
                  .map(e => {
                    // +1 is to shift from a 0-indexed list to a 1-indexed list.
                    return {
                      index: (+e[0]) + 1,
                      name: e[1].name.replace(/_/g, '-'),
                      count: e[1].count
                    };
                  });
      }

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = LogisticFilter;

// vi: sts=2 ts=2 sw=2 et

