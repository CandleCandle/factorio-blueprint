/**
 * Items with an inventory usually have a maximum number of inventory slots and
 * a 'bar' that can stop machines putting items into some
 */
const Inventory = (superclass) => class extends superclass {
    // maxInventory: int
    // bar: int

    bar(bar) {
      return this._property('_bar', bar);
    }

    maxInventory(bar) {
      return this._property('_maxInventory', bar);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.maxInventory) this.maxInventory(obj.maxInventory);
      if (obj.bar) { this.bar(obj.bar); } else { this.bar(-1); };
    }

    toObject() {
      const mine = {};
      if (this.bar() !== -1) {
        mine.bar = this.bar();
      }

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Inventory;
