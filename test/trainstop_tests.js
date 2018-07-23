const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('train stops', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const TrainStopEntity = mixwith.mix(entity.BaseEntity).with(entity.TrainStop);

    it('can read from an input object', function () {
      const entity = new TrainStopEntity();
      entity.fromObject({
        control_behavior: {
          send_to_train: true,
          read_from_train: true,
          read_stopped_train: true,
          train_stopped_signal: {type: 'virtual', name: 'signal-Q'}
        },
        station: 'The station name goes here'
      });
      assert.equal(entity.stationName(), 'The station name goes here');
      assert.equal(entity.sendToTrain(), true);
      assert.equal(entity.readTrainContents(), true);
      assert.equal(entity.readStoppedTrain(), true);
      assert.equal(entity.readStoppedTrainSignal().name, 'signal-Q');
    });
    it('can output to an object', function () {
      const entity = new TrainStopEntity()
              .name('train-stop')
              .stationName('stop name goes here')
              .sendToTrain(true)
              .readTrainContents(true)
              .readStoppedTrain(true)
              .readStoppedTrainSignal({type: 'virtual', name: 'signal-P'})
              ;
      const obj = entity.toObject();
      assert.equal(obj.control_behavior.send_to_train, true);
      assert.equal(obj.control_behavior.read_from_train, true);
      assert.equal(obj.control_behavior.read_stopped_train, true);
      assert.equal(obj.control_behavior.train_stopped_signal.name, 'signal-P');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et