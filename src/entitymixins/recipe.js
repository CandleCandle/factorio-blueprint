const Recipe = (superclass) => class extends superclass {
    // recipe: string: recipe name

    recipe(recipe) {
      return this._property('_recipe', recipe);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.recipe) this.recipe(obj.recipe);
    }

    toObject() {
      const mine = {
        recipe: this.recipe().replace(/_/g, '-')
      };

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Recipe;
