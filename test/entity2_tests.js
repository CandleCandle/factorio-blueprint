
const assert = require('assert');
const entity = require('../src/entity2');
const Victor = require('victor');

/*
 *
 * Parsing tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('entity mixins', function () {
  describe('', function () {
    it('can do filter inserters', function () {
        class FilterInserter extends entity.mix(entity.BaseEntity).with(entity.Position, entity.Direction, entity.Filters) {
          /* ... */
        }
        const fi = new FilterInserter()
                .name("filter-inserter")
                .x(4).y(5)
                .direction(6)
                .filters({0: "stone"})
                ;

        const obj = fi.toObject();
        console.log("obj:", obj);

        assert.equal(obj.name, 'filter-inserter');
        assert.equal(obj.position.x, 4);
        assert.equal(obj.position.y, 5);
        assert.equal(obj.direction, 6);
        assert.equal(obj.filters["0"], 'stone');

    });
  });
});