const Alarm = (superclass) => class extends superclass {

    alarmPitchFromSignalValue(value) {
      return this._property('_alarmPitchFromSignalValue', value);
    }
    alarmInstrumentId(value) {
      return this._property('_alarmInstrumentId', value);
    }
    alarmNoteId(value) {
      return this._property('_alarmNoteId', value);
    }
    alarmPlaybackVolume(value) {
      return this._property('_alarmPlaybackVolume', value);
    }
    alarmPlaybackGlobally(value) {
      return this._property('_alarmPlaybackGlobally', value);
    }
    alarmPlaybackAllowPolyphony(value) {
      return this._property('_alarmPlaybackAllowPolyphony', value);
    }
    alarmAlertShowAlert(value) {
      return this._property('_alarmAlertShowAlert', value);
    }
    alarmAlertShowOnMap(value) {
      return this._property('_alarmAlertShowOnMap', value);
    }
    alarmAlertIcon(name, type) {
      if (typeof name !== 'undefined' && typeof type !== 'undefined') {
        var obj = {name: name, type: type};
      }
      return this._property('_alarmAlertIcon', obj);
    }
    alarmAlertMessage(value) {
      return this._property('_alarmAlertMessage', value);
    }

    fromObject(obj) {
      super.fromObject(obj);
      if (obj.control_behavior && obj.control_behavior.circuit_parameters) {
        const cp = obj.control_behavior.circuit_parameters;
        if (typeof cp.signal_value_is_pitch !== 'undefined') this.alarmPitchFromSignalValue(cp.signal_value_is_pitch);
        if (typeof cp.instrument_id !== 'undefined') this.alarmInstrumentId(cp.instrument_id);
        if (typeof cp.note_id !== 'undefined') this.alarmNoteId(cp.note_id);
      }

      if (obj.parameters) {
        const p = obj.parameters;
        if (typeof p.playback_volume !== 'undefined') this.alarmPlaybackVolume(p.playback_volume);
        if (typeof p.playback_globally !== 'undefined') this.alarmPlaybackGlobally(p.playback_globally);
        if (typeof p.allow_polyphony !== 'undefined') this.alarmPlaybackAllowPolyphony(p.allow_polyphony);
      }

      if (obj.alert_parameters) {
        const ap = obj.alert_parameters;
        if (typeof ap.show_alert !== 'undefined') this.alarmAlertShowAlert(ap.show_alert);
        if (typeof ap.show_on_map !== 'undefined') this.alarmAlertShowOnMap(ap.show_on_map);
        if (ap.icon_signal_id) this.alarmAlertIcon(ap.icon_signal_id.name, ap.icon_signal_id.type);
        if (ap.alert_message) this.alarmAlertMessage(ap.alert_message);
      }
    }

    toObject() {
      const mine = {
        control_behavior: {
          circuit_parameters: {
            signal_value_is_pitch: this.alarmPitchFromSignalValue(),
            instrument_id: this.alarmInstrumentId(),
            note_id: this.alarmNoteId()
          }
        },
        parameters: {
          playback_volume: this.alarmPlaybackVolume(),
          playback_globally: this.alarmPlaybackGlobally(),
          allow_polyphony: this.alarmPlaybackAllowPolyphony()
        },
        alert_parameters: {
          show_alert: this.alarmAlertShowAlert(),
          show_on_map: this.alarmAlertShowOnMap(),
          icon_signal_id: this.alarmAlertIcon(),
          alert_message: this.alarmAlertMessage()
        }
      };

      const sup = (super.toObject) ? super.toObject() : {};
      if (sup.control_behavior) {
        // if we just do '{...sup, ...mine}' then any previous control_behavior would be overwritten
        mine.control_behavior = {...sup.control_behavior, ...(mine.control_behavior)};
      }
      return {...sup, ...mine};
    }
};

module.exports = Alarm;

// vi: sts=2 ts=2 sw=2 et

