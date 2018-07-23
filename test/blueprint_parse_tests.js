const assert = require('assert');
const Blueprint = require('../src/index');
const util = require('../src/util');
const Victor = require('victor');

/*
 *
 * Parsing tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('Blueprint Parsing', function () {
  describe('simple, small', function () {
    it('2x walls centered on one of them', function () {
      const input = '0eNqNj8EKgzAQRP9lzhGqFiv5lVKKtktZiBsx0TZI/r2JXgrtoadllpm3syt6M9M4sXjoFXyz4qDPKxw/pDN558NI0GBPAxSkG7Jy3goVz84YRAWWO72gy3hRIPHsmXbKJsJV5qGnKRl+5RVG61LESr6WMEWyhTxiVF+I6i/ETkiAVGgrrj/+VFhocpu5aU9V2dbNoT7G+AaeUViT';
      var bp = new Blueprint().load(input);
      var wall1 = bp.findEntity(new Victor(-1,-1));

      assert.equal(wall1.name, "stone_wall");
      assert.equal(wall1.position.x, -1);
      assert.equal(wall1.position.y, -1);

      var wall2 = bp.findEntity(new Victor(1,1));
      assert.equal(wall2.name, "stone_wall");
      assert.equal(wall2.position.x, 1);
      assert.equal(wall2.position.y, 1);
    });
  });

  describe('directions', function () {
    it('supports belts going in all directions', function () {
      const input = '0eNqV0dFqwzAMBdB/uc82xEnoin9ljJG02jAkirHV0hD874sTGO2atuzRNjq6sia03Yl8cCywE9xh4Aj7PiG6b266fCejJ1g4oR4K3PT5JKHh6IcguqVOkBQcH+kCa5J6WfzVRNEPhTJ9KBCLE0drluUwfvKpbynMLR6lUPBDnMsGzq1nqlAYYbVJOdQfpfxV6OIDxahfadosXDFHPbpAh/Vpt2FXT0e9gzfdcsOt/zm5uSXr/LPLKuzV2hXOFOI6y/6tNPtqV1R1Sj8D1bWS';
      var bp = new Blueprint().load(input);
      var n = bp.findEntity(new Victor(0,-1));
      var e = bp.findEntity(new Victor(1,0));
      var s = bp.findEntity(new Victor(0,1));
      var w = bp.findEntity(new Victor(-1,0));

      assert.equal(n.name, "transport_belt");
      assert.equal(n.direction, Blueprint.UP);
      assert.equal(n.position.x, 0);
      assert.equal(n.position.y, -1);
      assert.equal(e.name, "fast_transport_belt");
      assert.equal(e.direction, Blueprint.RIGHT);
      assert.equal(e.position.x, 1);
      assert.equal(e.position.y, 0);
      assert.equal(s.name, "transport_belt");
      assert.equal(s.direction, Blueprint.DOWN);
      assert.equal(s.position.x, 0);
      assert.equal(s.position.y, 1);
      assert.equal(w.name, "express_transport_belt");
      assert.equal(w.direction, Blueprint.LEFT);
      assert.equal(w.position.x, -1);
      assert.equal(w.position.y, 0);
    });
  });

  describe('recipes', function () {
    it('supports recipes in assemblers', function () {
      const input = '0eNp9j8EKwjAQRP9lzim0KrXkV0QkrUtdSDalSdVS+u8m8eLJy8Iss29mN/R2oWlmidAbePASoC8bAo9ibN7FdSJocCQHBTEuKxMCud6yjJUzw4OFqga7Asud3tDNflUgiRyZvrwi1pssrqc5Gf6TFCYf0rGX3CABa4U1zZQw08ClUIg+eV/GWuS00k//vKPwpDkURNudD013bOvjad8/hm1RIQ==';
      var bp = new Blueprint().load(input);
      var assembler = bp.findEntity(new Victor(0,0));

      assert.equal(assembler.name, "assembling_machine_1");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, -1);
      assert.equal(assembler.position.y, -1);
      assert.equal(assembler.recipe, 'stone_wall');
    });
  });

  describe('modules', function () {
    it('supports modules in assemblers', function () {
      const input = '0eNp9kNFqwzAMRf9Fzw60zeiKf2WMkTg3rZgtG9spC8H/Pjt96Rj0xXCtq6sjbTTaBSGyZNIbsfGSSH9slPgqg21/eQ0gTZzhSJEMrqkhJbjRslw7N5gbC7qeiiKWCT+kj+VTESRzZjzydrF+yeJGxGp4naQo+FSbvTSCGnhQtNa3TogwvANFb76Ru3mBrf6Gl5o5BWDqnJ8W25LaJMwzTOZ7BfhbCLGq/5VTafj7wvrpPoruiGlnOl/eT8dLfz70b6X8AvmFbMw=';
      var bp = new Blueprint().load(input);
      var assembler = bp.findEntity(new Victor(0,0));

      assert.equal(assembler.name, "assembling_machine_3");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, -1);
      assert.equal(assembler.position.y, -1);
      assert.equal(assembler.recipe, 'rocket_fuel'); // XXX should be rocket-fuel?
      assert.equal(assembler.modules['speed_module_3'], 1);
      assert.equal(assembler.modules['effectivity_module_3'], 1);
      assert.equal(assembler.modules['productivity_module_3'], 2);
      //assert.equal(assembler.modules, {'speed_module_3': 1, 'productivity_module_3': 2, 'effectivity_module_3': 1}); // Should work out why this assertion does not pass.
    });
  });

  describe('filter inserters', function () {
    it('stack filter inserters have only one filter', function () {
      const input = '0eNqFj9EKgzAMRf/lPlfQOZz0V4YMddkI01TaOibSf1+rbOxtLyE35J7crOiGmSbL4qFXcG/EQZ9XOL5LO6SZXyaCBnsaoSDtmJTzbf/Ibjx4shmLIxsbBAWWK72gi9AokHj2TDtwE8tF5rGLm7r4g1KYjItuIylDJOYKS6zxxL66Uz/nvjS2RjJjCaFJEbbU+udJhWf0btiqPh2Kuqzy8hjCG3KaWUM=';
      var bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, "stack_filter_inserter");
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
    });
    it('have multiple filters', function () {
      const input = '0eNp1j90KgzAMhd8l1x34M5z0VYYMddkIaFraOibSd19amexmNyHJSb6TbDBMC1pHHEBvQKNhD/q6gacn91PqhdUiaKCAMyjgfk7Vg6aA7kTs0UkCUQHxHd+gy9gpQA4UCHdULtYbL/Mgk7r8C1FgjZc9w8lXWIWCVaLA99Gd9zU6OOQMn4xDueJQq0MdjbXikvUuHZc/0T+PK3gJO9s27aUq27op6nOMH0+tXzQ=';
      var bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, "filter_inserter");
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
      assert.equal(entity.filters['1'], 'copper_ore');
    });
  });

  describe('inventory filters', function () {
    // What sort of entity has inventory filters?
  });

  describe('logistic filters', function () {
    it('knows about requester chests', function () {
      const input = '0eNqFkN1uwjAMhd/F14nUlomhvMqEUEhNsdQ6XX5gVdV3x2kH7G5Xlq1zvmN7hnOfcQzECcwM5DxHMF8zROrY9mWWphHBACUcQAHboXS97ygmctpdMSYd8DtLxQCLAuIWf8DUy1EBcqJEuDHXZjpxHs6iNPX/NAWjjwLwXDYRqBbTBKaSmF/V6UK9SLeEZ/SLbNubZYetdhRcpiRE53M5tqkE8nY0L0uwd333vn1La5EeyzXrD8yflym4SfS63v7w2dSH3b7afSzLA3pZc0M=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-1,0));

      assert.equal(entity.name, 'logistic_chest_requester');
      assert.equal(entity.requestFilters['0'].name, 'advanced_circuit');
      assert.equal(entity.requestFilters['0'].count, 200);
      assert.equal(entity.requestFilters['11'].name, 'raw_wood');
      assert.equal(entity.requestFilters['11'].count, 100);
    });
    it('knows about storage chests', function () {
      const input = '0eNqFjsEKgzAQRP9lzhG0LVbyK6UUtYtd0I0ka1Ek/16TXnrrcYaZx9vRjQvNnkVhd3DvJMDedgQepB1Tp9tMsGClCQbSTimNbuCg3Bf9i4IWQZ1vB0I0YHnSClvFuwGJsjJ9iTlsD1mmjvwx+McymF047k6SxZofG2wZEznb2B95gzf5kMd1cz1Vzbkuz5cYP3muTDQ=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(1,0));
      assert.equal(entity.name, 'logistic_chest_storage');
    });
    it('knows about storage chests with filters', function () {
      const input = '0eNqFj8EKgzAQRP9lzxG0Fiv5lSKidmsXdGOTtSiSf2+itPTW4yw7b2Y2aIcZJ0ssoDegzrADfd3AUc/NEG+yTggaSHAEBdyMUQ2mJyfUJd0DnSROjG16BK+A+IYL6MxXCpCFhPAg7mKteR5btOHhH0vBZFywG44tlt2xgk5DhsXnHF7rOw2C9sB/cr9YsoYTYyOoM3Pcl/oqttqX6J/hCl6BsgcV5eWUlXmR5mfv3w0JYHM=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(1,0));
      assert.equal(entity.name, 'logistic_chest_storage');
      assert.equal(entity.requestFilters['0'].name, 'iron_ore');
      assert.equal(entity.requestFilters['0'].count, 0);
    });
  });
  it('knows about buffer chests', function () {
      const input = '0eNqFkNsKgzAMht8l1xU8jE36KkNEXdwCtXU2HYr47ksdO9ztMuX7v+TvCq0JOE5kGfQK1DnrQZ9X8HS1jYlvvIwIGohxAAW2GeJk3JU8U5d0N/SctKHvcYJNAdkLzqCzrVKAlokJX8J9WGobhlZInf1RKRidl7Sz8YZ5DyygU1kx4T0IWfdkGKeX/b32Y/WMaJLRNIzi6lyIBbNU8l84/9Btw6JavmQuZBU77LX1zy8peMjS/a5jecqzsjimxWHbnvgJbh8=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(1,0));

      assert.equal(entity.name, 'logistic_chest_buffer');
      assert.equal(entity.requestFilters['0'].name, 'steel_plate');
      assert.equal(entity.requestFilters['0'].count, 100);
      assert.equal(entity.requestFilters['11'].name, 'battery');
      assert.equal(entity.requestFilters['11'].count, 200);
    });

  describe('bars', function () {
    it('has a box with no bar', function () {
      const input = '0eNptjsEKgzAQRP9lzhG0Fiv5lVKK2qVdiKuYVSoh/97EXnrocZY3bzagdyvNC4vCBvAwiYe9Bnh+SufyTfeZYMFKIwykG3PySuSK4UVeEQ1YHvSGreLNgERZmb6aI+x3WceelgT8FRjMk0+dSfJe8hSJ22HLmH3HsP3502CjxR90015OVVs3ZX2O8QPQS0Ob';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-1,0));

      assert.equal(entity.name, 'steel_chest');
      assert.equal(entity.bar, -1);
    });
    it('has a box with some bar', function () {
      const input = '0eNptjt0KwjAMhd/lXFfYH3P0VURkm0EDXTbWTByj725bb7zwJnBCvi/nwOA2WlYWhT3A4ywe9nLA80N6l3a6LwQLVppgIP2Uklcidxqf5BXBgOVOb9gyXA1IlJXpq8lhv8k2DbTGg78Cg2X2kZkl/YuewmCPM4qHPlJVk7y5gP3pa/Ci1Weq7c5V2dVtUTchfADkJ0Wy';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, 'steel_chest');
      assert.equal(entity.bar, 24);
    });
  });

  describe('arithmetic combinators', function () {
    it('describes multiplication', function () {
      const input = '0eNqVktFqwzAMRf9Fj8MZbbJ1Ja/9jDGCk2itILaDLZeV4H+fnEBX1nXdXgyypavjK03QDhFHT5ahnoA6ZwPUrxME2ls95Ds+jQg1EKMBBVabHGlPfDDI1BWdMy1Zzc5DUkC2xw+o1+lNAVomJlwE5+DU2Gha9JJwljLYUzQFDtixF73RDSiNRhek2NmMIILFRsEp6yoQRiu5NKNOsM6Hx/6yC0lUSSb5LhLPoRCllNQVSPlPkOdfOfYe0d4hKW+QVHfcvfZk9bjQlELTk19g5i8JG3s3NC0e9JGkWCq+VBt57ulM/k4+cHNn4i3tv1kjTQNmpSwXWOcVkrG6Eb1eQOBB6l3kMf4gfyTPUW7OHZaMYgfZnb9OOY9VQXnT+8VsWcb5N/XFuis4og8z52b7Uq631WZVPaX0CRchDRw=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-1,2));

      assert.equal(entity.name, 'arithmetic_combinator');
      assert.equal(entity.condition.left, 'big_electric_pole');
      assert.equal(entity.condition.operator, '*');
      assert.equal(entity.condition.right, 1);
      assert.equal(entity.condition.out, 'signal_C');
    });
    it('describes modulo', function () {
      const input = '0eNqVklFqwzAMhu8i2Jsz2mTrSu7QE4wRnERrBbEdbLmsBN99cgJdWdd1ezHIln59/qUJ2iHi6Mky1BNQ52yA+nWCQHurh3zHpxGhBmI0oMBqkyPtiQ8Gmbqic6Ylq9l5SArI9vgB9Tq9KUDLxISL4BycGhtNi14SzlIGe4qmwAE79qI3ugGl0eiCFDubEUSw2Cg4ZV0Fwmgll2bUCdb58NhfdiGJKskk30XiORSilJK6Ain/CfL8K8feI9o7JOUNkuqOu9eerB4XmlJoevILzPwlYWPvhqbFgz6SFEvFl2ojzz2dyd/JB27uTLyl/TdrpGnArJTlAuu8QjJWN6LXCwg8SL2LPMYf5I/kOcrNucOSUewgu/PXKeexKihver+YLcs4/6a+WHcFR/Rh5txsX8r1ttqsqqeUPgEYnQ0h';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-0.5,2));

      assert.equal(entity.name, 'arithmetic_combinator');
      assert.equal(entity.condition.left, 'big_electric_pole');
      assert.equal(entity.condition.out, 'signal_M');
      assert.equal(entity.condition.operator, '%');
    });
  });

  describe('decider combinators', function () {
    it('uses "each"', function () {
      const input = '0eNqVkttqwzAMht9F185ok7bbcrEXGSM4idoK4gOKUxaC331yMkJpt7LdGHT8P0uaoO4G9Ew2QDkBNc72UL5P0NPJ6i75wugRSqCABhRYbZLVYkMtctY4U5PVwTFEBWRb/IRyGz8UoA0UCJduszFWdjA1siSsfQy2NJgMO2wCU5N516GoeNdLsbNJXxpmBwVj6qtAAK3k0sw5wTY9jO21ComVSyZxM1CYTSGKMao7kPzRh+4xNk/7FaQlXjgWMWcDu66q8awvJMVS8d2yklhLK/GRuA/V3XgvxGEQzwq0ZGSomzMs/+6DTlvavSbLeM0zZQlvkBx+FKHBhurIzlRk/SC5R931GP8+tjQnBXmKnhjR3saLX+ZY/HOh+4f7/FH6ZqP5TCJ3Nt9leXXGCi7I/ax1eHnOty/FYVPsYvwCygX/SA==';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-1,1));

      assert.equal(entity.name, 'decider_combinator');
      assert.equal(entity.condition.left, 'signal_each');
      assert.equal(entity.condition.right, 49);
      assert.equal(entity.condition.operator, '>');
    });
  });

  describe('constant combinators', function () {
    it('basic setup', function () {
      const input = '0eNqNkdFqwzAMRf9Fzw7UyehCfmWU4jjaJrDl4DihIfjfJ7tQCoXRFxuZq3t15ANGt+IciRMMB5ANvMDwdcBCP2xceUv7jDAAJfSggI0vVdElw6mxwY/EJoUIWQHxhDcYdL4oQE6UCO92tdivvPoRowj+NVIwh0V6A5d88Ws6BbtcWiKkIcXgriP+mo1ELZJvcgnjW4ObaTNscWosRbtSgmq5Fvz+9ADo8+UexWjLHEvx0+WIOD0DkVStiHNWL5DtI9TjRKtv0IlbJNvMweErZVsh9fvBugbLqivi8PSVCjbZR7U+95+t7rvzqfvI+Q/5g6g5';
      const decoded = util.decode[0](input);
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-3,-1));

      assert.equal(entity.name, 'constant_combinator');
      assert.equal(entity.constants['7'].name, 'advanced_circuit');
      assert.equal(entity.constants['7'].count, 80);
      // XXX should assert on {entity}.control_behaviour.is_on == true / undefined.
    });
    it('with "output off" set', function () {
      const input = '0eNqNkeGKwyAQhN9lfxuoydELeZWjFGO2dwu6BjXhQvDdz02hFApH/ygr48x8usPoFpwjcYZhB7KBEwxfOyT6ZuPkLG8zwgCU0YMCNl4m0WXDubHBj8QmhwhFAfGEvzDoclGAnCkT3u2OYbvy4keMVfCvkYI5pHo3sORXv6ZVsNVN14h6IcfgriP+mJWqukpu5DLGt4qbaTVscWosRbtQhsNyEfz+9ADoBYDSVRrcjEt4D2a00iqJu5Yl4vSMR3Vqy6WUol6Q20cFjxMtvkFX3SLZZg4OX5m7A1m/H6yPYOktwMPTxypY6+sc1uf+s9V9dz51H6X8AWGKrQY=';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(-2,-1));

      assert.equal(entity.name, 'constant_combinator');
      assert.equal(entity.constants['7'].name, 'advanced_circuit');
      assert.equal(entity.constants['7'].count, 80);
      // XXX should assert on {entity}.control_behaviour.is_on == false.
    });
  });

  describe('power switches', function () {
    it('simple example', function () {
      const input = '0eNqVUkFugzAQ/MueTWUgoRGHXvKMKEJgts1KYCPbhCLE37uGKEobpLYX5LFnZzxjJqiaHjtL2kM+ASmjHeSnCRx96LIJe37sEHIgjy0I0GUbUGcGtJEbyKsLzAJI1/gJeTyfBaD25AlXnQWMhe7bCi0TthUEQ8dDRgdHForky17AuC5Yn+/lrWmKCi/llYwNNEVW9eQLPqvvs+9knS9+uT02qFhOk4puIrB6OF+GInYyoLYrbemDF7zBvBI0D9LS0QRx+FisH3MSo2Q+M/nYy6cDAQNZXNYyNHXs45+c9DuHbZ86TO45Wqypb6M1DofpTIMbXWZLk/LvCeJgvOGc/tN5fzMOWZcXyB9+NwFXtG4hZ4fXJD6kmUx38/wFX4PeRw==';
      const bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, 'power_switch');
      assert.equal(entity.condition.left, 'electronic_circuit');
      assert.equal(entity.condition.right, 40);
      assert.equal(entity.condition.operator, '>');
      // XXX should assert on {entity}.connections.Cu0/Cu1
    });
  });

  describe('circuit conditions', function () {
    it('can enable/disable train stops', function () {
      const input = '0eNqdlsFu2zAMht+FZ7uIZCf1fOihxwK9DdihKAzFZhMCtmxIctAg8LtPtIcsWxKA7SUGJfHjT1KEcoJtO+LgyAYoT0B1bz2UbyfwtLOm5bVwHBBKoIAdJGBNx5Yz1MKUANkGP6FU03sCaAMFwsV/No6VHbstunjg7Bmiq0196IdIG3ofXXrLcSImVTqBY/zqiG7IYb1sbhKIwoLr22qLe3Og3rFHTa4eKVRxrzljPsj5UF3JP5ALY1w561hOpMYew57sjpPh5IPhSqzY6AbjTOBQ8DRv/wmH1mxbrBry/IUyuBET8GibKvTVnB+UH6b1cXW2Ks52wEau6idMix67lMCzj+Ifh81lfSlaenrn01H6UgN4/fXy8hwVX3VBn+N02NDYpdhGvqM6HfqYyXU/1g/rpSHqYS0XpC5Cs52xwBtysi/KUd9So/9Tk99Rk39RTfEtNfdqsf57BfjO7PYhnWfsxozkc9jVvyOibzA3cqaWMh/lzJWUWYiZhRT5Q4zcSJGcj5Ap7pBSYqa4Q0pLmeIGqUyKlKvMpUh5McUzJO+5eITEN1OJJ0g+QEo8QfcGPT7f8wNfXvwfSOCAzi8PcPGoVZFtVlk+Tb8BQcK+7A==';
      const bp = new Blueprint().load(input);
      const train_stop = bp.findEntity(new Victor(-12, -2));

      assert.equal(train_stop.name, "train_stop");
      // XXX need to switch mode between odd-integral and even-integral.
      assert.equal(train_stop.position.x, -13);
      assert.equal(train_stop.position.y, -3);
      assert.equal(train_stop.condition.controlEnable, true);
      assert.equal(train_stop.condition.left, 'signal_anything');
      assert.equal(train_stop.condition.operator, '>');
      // XXX assert.equal(train_stop.condition.constant, 0);
      // XXX assert.equal(train_stop.condition.modes['send_to_train'], 'false');
    });
//    it('can handle signals', function () {
//    });
//    it('can handle coloured lamps', function () {
//    });
//    it('can handle programmable speakers', function () {
//    });
    it('can read electric ore miners', function () {
      const input = '0eNrVVW1rwjAQ/ivjPqejSTt1/StDpC83PUhTSdIxkfz3JSkTdROjg7F9SXu95nm5Nnd7aOSIW03KQrUHagdloHrZg6G1qmV4ZndbhArIYg8MVN2HCCW2VlOb9aRIrbNOk5TgGJDq8B0q7thVDF3T8RbhlgxQWbKEk4YY7FZq7BvUHvMKO4PtYPzuQQVKj5iJxycGu+nGE3Wk/b6YLxl4q1YPctXgpn6jQYdNLel2JLtCVTcSVx2ZcIXqtZYG2SGtse78YoZRt0Gr1eNJdkpMr/VD5wFyFwnVxG8CFw+Lxu7YKvmocEvnQvnO7Itb7ef/0X15wX1xcN9jR2OfHYqwHbzGr9++/HTPo/tEen5EPck5jTm/oK+8UZ+4S544k1OcyxMX5D0d5Bnrz916Y7N4/L7WbRZl5ac/jPgGcpYMWaZCzpMhRSrkIhUyT0V8TkVM1sjzVMjkSvL7m6X4/CF/rz/wn3dHfnd7/Nt+p37oJ2OcndXRuGYg6wZlGKQe2Rt9iEaNT7yhNtHobDEXfFHM8qJ07gOJG7mk';
      const bp = new Blueprint().load(input);
      miner_1 = bp.findEntity(new Victor(-2, -2));

      assert.equal(miner_1.name, "electric_mining_drill");
      // TODO circuit_read_resources & circuit_resource_read_mode
    });
  });
  describe('directions & positions', function () {
    it('understands 2x1 entities (combinators)', function () {
      const input = '0eNrNl1tugzAQRfcy31BhQ0iKupOqQjyc1hLYyJg0KGLv9YO0qUKruiKKvyKG8fVwdD0Tn6BsBtIJyiRkJ6AVZz1kzyfo6SsrGh2TY0cgAypJCwGwotVPNaloTURY8bakrJBcwBQAZTU5QoamlwAIk1RSYtXMw5izoS2JUAm/6QTQ8V4t5UzvfjTZI2Rh/LBRW6gCpeBNXpK34kBVusqZRXL1rjYLex3dU9HL/Oo7DlTIQUU+S7AZYaQ/oCda4++LMJiS2q4QpvYMnkAHulEVMzCZ7wVvc8q6QeGVYiDTNAVXOLATjsjiSDzEgVbBETvh0L6wRLDavKaCVPZtekM66f3MkrjRwWc6sed04lXobJzo4Nk4Hh6ldXCkbmZJzmZBnptlnUaz/ZKVnJHwvWiaBSp2/kRLCjsXBUV1QeLxTxLRzzWgyEFhuQbkNpDPHTf67hJ8Q5fg+7kEYcd5ZNgg01Mu6CQ3pJPcr8Mgx2ltWy72ns46wxq5TWs0Hyzs+cFayTqOw3qGgzyHs5JzHEe3HTGx9+fqPz1Z3SbN7TO7uKwG0BQlUTuCxUJEr2IH9WP/sey2GO3iNIqTafoAsb0nAg==';
      const bp = new Blueprint().load(input);

      const e1 = bp.findEntity(new Victor(-2, -2));
      assert.equal(bp.entities.filter(e => e.position.x === 0 && e.position.y === 0)[0].name, "stone_wall");
      assert.equal(bp.entities.filter(e => e.position.x === 2 && e.position.y === -3)[0].name, "decider_combinator"); // 0/3, direction 0
      assert.equal(bp.entities.filter(e => e.position.x === -5 && e.position.y === -1)[0].name, "decider_combinator"); // 6/1, direction 6
      assert.equal(bp.entities.filter(e => e.position.x === 3 && e.position.y === 0)[0].name, "decider_combinator"); // 2/1, direction 2
      assert.equal(bp.entities.filter(e => e.position.x === -3 && e.position.y === 1)[0].name, "decider_combinator"); // 4/3, direction 4
    });
    it('understands 2x3 entities (boilers)', function () {
      const input = '0eNqNkdsKwjAMht8l11V2dvRVRGTTIIEuHWs9jNF3t91geJjMq5D075fkzwC1umLbEVuQA9BJswG5H8DQhSsVarZvESSQxQYEcNWErNaksAMngPiMD5CxOwhAtmQJJ8KY9Ee+NrVXyvjzr4BWGy/XHLp4xMZLeh+Sbe6c+AIk64B0m4+IyM91pg5P02OxQEtXafEyLFmAZTPMWM24uVdK/dwvWlou/9edYM7bPFkwfjyOfLmlAFXVqGae8ZWbD5Mf5S6Jy7SI0sy5J2Yjpzs=';
      const bp = new Blueprint().load(input);

      const e1 = bp.entities.filter(e => e.name === 'boiler' && e.direction === 0)[0];
      assert.equal(e1.position.x, -2);
      assert.equal(e1.position.y, -3);
      const e2 = bp.entities.filter(e => e.direction === 2)[0];
      assert.equal(e2.position.x, 1);
      assert.equal(e2.position.y, -1);
      const e3 = bp.entities.filter(e => e.direction === 4)[0];
      assert.equal(e3.position.x, -2);
      assert.equal(e3.position.y, 2);
      const e4 = bp.entities.filter(e => e.direction === 6)[0];
      assert.equal(e4.position.x, -4);
      assert.equal(e4.position.y, -1);
    });
    it('understands 3x3 entities (furnaces)', function () {
      const input = '0eNqV0uFqgzAQB/B3+X+OULWzklcZY0R3HYF4ShLXivjuO+0og7qyfAp35H7hcjejcSMN3nKEnmHbngP064xgP9m4NRengaBhI3VQYNOtETlqo7dtdh49m5awKFj+oCt0vrwpEEcbLd2sLZjeeewa8nLhb0Vh6IMU9ry+LFhWKkxyHJdFPUBFAlQ8ccq7E2LPlF2Mc4/C4SYUe8LxX0KWPyFe0n8l33OqlGZ2hVNSM7tEnTwZYWRttiXTv3ZSwZmGZA/xUx8k9UU+bPVVfSryuqwOpcz1G3+87Q8=';
      const bp = new Blueprint().load(input);

      assert.equal(bp.entities.filter(e => e.position.x === -4 && e.position.y === -5)[0].name, "electric_furnace");
      assert.equal(bp.entities.filter(e => e.position.x === 1 && e.position.y === -5)[0].name, "electric_furnace");
      assert.equal(bp.entities.filter(e => e.position.x === -4 && e.position.y === 0)[0].name, "electric_furnace");
      assert.equal(bp.entities.filter(e => e.position.x === 1 && e.position.y === 0)[0].name, "electric_furnace");
    });
  });

  describe('roboports', function () {
    it('circuit connected roboports', function () {
      const input = '0eNqlkt1qwzAMhd9F12mJHbp2eZVRQn60TRBbRnHKQvC7T0nYyCiDjt3YHCGd8xlrhqYfMQj5COUM1LIfoHyZYaA3X/dLLU4BoQSK6CADX7tFCTccWCKkDMh3+AGlSdcM0EeKhJvHKqbKj65B0YbvaYcdje6APbZRqD0E7lG9Aw86zH5JVcODDkx6FZqhXF6bacWbwSyHYLePIVU2ZT90ka4p7WpfKPb+Iffx9nhaAfLjaSOIwn3V4Ht9I5alqyVpR4qV4w4rfq04oNSbRf44tPkFsngA0vyH0fyVUT94XYNytzUZ3FCG1e/pcrb2Yp7zs03pE5uVzbI=';
      const bp = new Blueprint().load(input);

      const readLogisticsNetwork = bp.findEntity(new Victor(-3, 0));
      assert.equal(readLogisticsNetwork.name, "roboport");
      assert.equal(readLogisticsNetwork.wrapped.circuitModeOfOperation(), 0);

      const readRobotStatistics = bp.findEntity(new Victor(2, 0));
      assert.equal(readRobotStatistics.name, "roboport");
      assert.equal(readRobotStatistics.wrapped.circuitModeOfOperation(), 1);
    });
  });

  describe('train stops', function () {
    const input = '0eNq9l9tu4jAQhl9l5WvCenw2F/sUe7eqokDc1lIOyDHVVoh333HSsC11W8JFbxJ8+v17vhkDR7JtDm4ffBfJ5kj8ru8GsvlzJIN/6Kom9cXnvSMb4qNryYp0VZtaofINOa2I72r3l2zgdLciros+ejetHxvPZXdoty7ghPPK1tX+0BaucbsY/K7Y941D3X0/4OK+SzuiYCHXckWepw+4D/rqcIEf7R0JpEdw9eutPLZw6pu2Pt2dTq/6ZjtsqR24yY6+sGM/sMMX2mE3ubEXbgA+sCPOdoaIoB8eYzHyfh8WM9lgORV5VkkiXTHEfp+RULPEeI4Y+qbcusfqyfchTdn5sDv4WOJYfV5378MQyy9S1HeDCxGdTMpDrFKOy9Ro91WoYtqA/BqHXzZxXbVtXFn7Ib3JJoaDW5HBdXUZ+3I8BtncV82AvWOrTIfau/q9lycf4qFq/tuZZhS/yel6YiMgNBCr6eRkMvhzNpiEmilO+KBrKywFq4AaA4ZKAdYyMBrP/JCGOWglNFVWWaYAlBWcS8vT+BbHV6RKs4Q1lOM6iS8QiivGqVCokoOsrk4V8Umq6OtShX2eKt9D5G0NsUtCKVmK2BdTsiwDNGFYGxg5gQbKqKTaAJO3sDHXsqGfoLFXofmCTL6Cgqvq8j707dw/ldt3YGQXGPklxuRtYlikA+HU4R1MpoWk1oDmCgwHpSSyoYrN5aaRkzJKCESkDRdCMyXH4VurDei1SD+rNoCrmKqbmc7svh1rHuPLnh+UJCisMMHBUnxIK4wwirOp5kaMklmBFWmZlhKYspLDzHCtVEoCAANpCgooMSXADWzZwm9dmlXhCy/kvIpYdnXkReSyZM2LqIVRyWe8XhiVvMrCCzUvYpdFJSvC6MKoiKwKLIxKXoUti0pehC+LCorgH47x997m1T+YFWmqrWvmi+1H29cu3dtPLgyjBBYfw9q2VGNc/wGFVi/a';
    it('knows about the enable/disable flag', function () {
      const bp = new Blueprint().load(input);

      const stop = bp.findEntity(new Victor(-7, -3));
      assert.equal(stop.name, "train_stop");
      assert.equal(stop.wrapped.circuitControlEnabled(), true);
      assert.equal(stop.wrapped.circuitControlFirstSignal().name, 'inserter');
      assert.equal(stop.wrapped.circuitControlComparator(), '>');
      assert.equal(stop.wrapped.circuitControlConstant(), 5);

      assert.equal(stop.wrapped.stationName(), "enable/disable");
    });
    // source blueprint is wrong; the relevent train stop at -3, -3 doesn't have the correct settings.
    it('knows about the send-to-train flag', function () {
      return ;
      const bp = new Blueprint().load(input);

      const stop = bp.findEntity(new Victor(-3, -3));
      assert.equal(stop.name, "train_stop");
      assert.equal(stop.wrapped.sendToTrain(), true);

      assert.equal(stop.wrapped.stationName(), "send-to-train");
    });
    it('knows about the read-train-contents flag', function () {
      const bp = new Blueprint().load(input);

      const stop = bp.findEntity(new Victor(1, -3));
      assert.equal(stop.name, "train_stop");
      assert.equal(stop.wrapped.readTrainContents(), true);

      assert.equal(stop.wrapped.stationName(), "read-train-contents");
    });
    it('knows about the read-stopped-train flag', function () {
      const bp = new Blueprint().load(input);

      const stop = bp.findEntity(new Victor(5, -3));
      assert.equal(stop.name, "train_stop");
      assert.equal(stop.wrapped.readStoppedTrain(), true);
      assert.equal(stop.wrapped.readStoppedTrainSignal().name, 'signal-T');

      assert.equal(stop.wrapped.stationName(), "read-stopped-train");
    });
  });
});

// vi: sts=2 ts=2 sw=2 et
