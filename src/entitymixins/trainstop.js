const TrainStop = (superclass) => class extends superclass {

    stationName(stationName) {
      return this._property('_stationName', stationName);
    }
    sendToTrain(sendToTrain) {
      return this._property('_sendToTrain', sendToTrain);
    }
    readTrainContents(readTrainContents) {
      return this._property('_readTrainContents', readTrainContents);
    }
    readStoppedTrain(readStoppedTrain) {
      return this._property('_readStoppedTrain', readStoppedTrain);
    }
    readStoppedTrainSignal(readStoppedTrainSignal) {
      return this._property('_readStoppedTrainSignal', readStoppedTrainSignal);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior) {
        const cb = obj.control_behavior;
        if (typeof cb.send_to_train !== 'undefined') this.sendToTrain(cb.send_to_train);
        if (typeof cb.read_from_train !== 'undefined') this.readTrainContents(cb.read_from_train);
        if (typeof cb.read_stopped_train !== 'undefined') this.readStoppedTrain(cb.read_stopped_train);
        if (typeof cb.train_stopped_signal !== 'undefined') this.readStoppedTrainSignal(cb.train_stopped_signal);
      }
      if (typeof obj.station !== 'undefined') this.stationName(obj.station);
    }

    toObject() {
      const mine = {
        control_behavior: {
          send_to_train: this.sendToTrain(),
          read_from_train: this.readTrainContents(),
          read_stopped_train: this.readStoppedTrain(),
          train_stopped_signal: this.readStoppedTrainSignal()
        },
        station: this.stationName()
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
  };

module.exports = TrainStop;


// vi: sts=2 ts=2 sw=2 et
