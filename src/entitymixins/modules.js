const Modules = (superclass) => class extends superclass {
    // items: object: {module_type: count}
    // modules: int // max count of modules

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
      const mine = {
        // fix key names to use hyphens and not underscores.
        items: Object.entries(this.modules())
                .reduce((acc, v) => {
                  acc[v[0].replace(/_/g, '-')] = v[1];
                  return acc;
                }, {})
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Modules;
