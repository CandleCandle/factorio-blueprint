const Modules = (superclass) => class extends superclass {
    // items: object: {module_type: count}
    // modules: int // max count of modules

    removeModules() {
      return this.modules({});
    }

    withModules(type, count) {
      if (this._modules) {
        const sum = Object.entries(this._modules).reduce((acc, entry) => acc + entry[1], 0);
        if (sum + count > this.maxModules()) {
          throw new Error("Cannot add more than " + this.maxModules() + " modules");
        }
      }
      if (typeof this._modules[type] === 'number' && this._modules[type]) {
        this._modules[type] += count;
      } else {
        this._modules[type] = count;
      }
      return this;
    }

    maxModules(maxModules) {
      return this._property('_maxModules', maxModules);
    }

    modules(modules) {
      return this._property('_modules', modules);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.modules) this.maxModules(obj.modules);
      if (obj.items) {
        this.modules(
                Object.entries(obj.items)
                .reduce((acc, v) => {
                  acc[v[0].replace(/-/g, '_')] = v[1];
                  return acc;
                }, {}));
      } else {
        this.modules({});
      };
    }

    toObject() {
      const mine = {};
      if (Object.keys(this.modules()).length > 0) {
        // fix key names to use hyphens and not underscores.
        mine.items = Object.entries(this.modules())
                  .reduce((acc, v) => {
                    acc[v[0].replace(/_/g, '-')] = v[1];
                    return acc;
                  }, {});
      }

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Modules;

// vi: sts=2 ts=2 sw=2 et

