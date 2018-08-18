const assert = require('assert');
const entity = require('../src/entitytypes');
const Victor = require('victor');
const mixwith = require('mixwith');



describe('Entity Features', function () {
  describe('entities with alarms', function () {
    // define the class outside the tests to ensure that it's the same class/prototype that is being tested.
    const AlarmEntity = mixwith.mix(entity.BaseEntity).with(entity.CircuitControl, entity.Alarm);
   

    it('can get/set the circuit_parameters/signal_value_is_pitch property', function () {
      const entity = new AlarmEntity();
      assert.equal(entity.alarmPitchFromSignalValue(true), entity); // setter returns the entity for function chaining.
      assert.equal(entity.alarmPitchFromSignalValue(), true);
    });
    it('can get/set the circuit_parameters/instrument_id property', function () {
      const entity = new AlarmEntity();
      assert.equal(entity.alarmInstrumentId(5), entity); // setter returns the entity for function chaining.
      assert.equal(entity.alarmInstrumentId(), 5);
    });
    it('can get/set the circuit_parameters/note_id property', function () {
      const entity = new AlarmEntity();
      assert.equal(entity.alarmNoteId(5), entity); // setter returns the entity for function chaining.
      assert.equal(entity.alarmNoteId(), 5);
    });
    it('can read from an input object', function () {
      const entity = new AlarmEntity();
      entity.fromObject({
        control_behavior: {
          circuit_condition: {
            first_signal: {
              type: "item",
              name: "locomotive"
            },
            constant: 0,
            comparator: ">"
          },
          circuit_parameters: {
            signal_value_is_pitch: false,
            instrument_id: 0,
            note_id: 3
          }
        },
        parameters: {
          playback_volume: 0.3,
          playback_globally: true,
          allow_polyphony: true
        },
        alert_parameters: {
          show_alert: true,
          show_on_map: true,
          icon_signal_id: {
            type: "item",
            name: "pipe-to-ground"
          },
          alert_message: "fds"
        }
      });
      console.log('entity', Object.keys(entity));
      assert.equal(entity.circuitControlFirstSignal().name, 'locomotive');
      assert.equal(entity.circuitControlConstant(), 0);
      assert.equal(entity.circuitControlComparator(), '>');
      assert.equal(entity.alarmPitchFromSignalValue(), false);
      assert.equal(entity.alarmInstrumentId(), 0);
      assert.equal(entity.alarmNoteId(), 3);
      assert.equal(entity.alarmPlaybackVolume(), 0.3);
      assert.equal(entity.alarmPlaybackGlobally(), true);
      assert.equal(entity.alarmPlaybackAllowPolyphony(), true);
      assert.equal(entity.alarmAlertShowAlert(), true);
      assert.equal(entity.alarmAlertShowOnMap(), true);
      assert.equal(entity.alarmAlertIcon().name, 'pipe-to-ground');
      assert.equal(entity.alarmAlertIcon().type, 'item');
      assert.equal(entity.alarmAlertMessage(), 'fds');
    });
    it('can output to an object', function () {
      const entity = new AlarmEntity()
          .name('programmable-speaker')
          .circuitControlFirstSignal('locomotive', 'item')
          .circuitControlConstant(3)
          .circuitControlComparator('=')
          .alarmPitchFromSignalValue(false)
          .alarmInstrumentId(4)
          .alarmNoteId(7)
          .alarmPlaybackVolume(0.9)
          .alarmPlaybackGlobally(false)
          .alarmPlaybackAllowPolyphony(true)
          .alarmAlertShowAlert(true)
          .alarmAlertShowOnMap(false)
          .alarmAlertIcon('pipe-to-ground', 'item')
          .alarmAlertMessage('fds')
              ;
      console.log('entity', Object.getOwnPropertyNames(entity));

      const obj = entity.toObject();
      console.log('obj', obj);
      assert.equal(obj.control_behavior.circuit_condition.constant, 3);
      assert.equal(obj.control_behavior.circuit_condition.first_signal.type, 'item');
      assert.equal(obj.control_behavior.circuit_condition.first_signal.name, 'locomotive');
      assert.equal(obj.control_behavior.circuit_condition.comparator, '=');
      assert.equal(obj.control_behavior.circuit_parameters.signal_value_is_pitch, false);
      assert.equal(obj.control_behavior.circuit_parameters.instrument_id, 4);
      assert.equal(obj.control_behavior.circuit_parameters.note_id, 7);
      assert.equal(obj.parameters.playback_volume, 0.9);
      assert.equal(obj.parameters.playback_globally, false);
      assert.equal(obj.parameters.allow_polyphony, true);
      assert.equal(obj.alert_parameters.show_alert, true);
      assert.equal(obj.alert_parameters.show_on_map, false);
      assert.equal(obj.alert_parameters.icon_signal_id.name, 'pipe-to-ground');
      assert.equal(obj.alert_parameters.icon_signal_id.type, 'item');
      assert.equal(obj.alert_parameters.alert_message, 'fds');
    });
  });
});


// vi: sts=2 ts=2 sw=2 et