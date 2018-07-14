const DirectionType = (superclass) => class extends superclass {

    directionType(directionType) {
      return this._property('_directionType', directionType);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.direction_type) this.directionType(obj.direction_type);
    }

    toObject() {
      const mine = {
        direction_type: this.directionType()
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = DirectionType;

// vi: sts=2 ts=2 sw=2 et

