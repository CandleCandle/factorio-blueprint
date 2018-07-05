class Connection {
  // side, colour ==> entity
  // colour is optional (see Cu0/Cu1 for manual copper connections - mostly found in power switches)
  // theirSide is also optional; Cu0/Cu1 don't show up on the other side
  constructor(otherEntity, mySide, theirSide, colour) {
    this.otherEntity = otherEntity;
    this.mySide = mySide;
    this.theirSide = theirSide;
    this.colour = colour;
  }

  static sideMapping(side) {
    mapping = {
      '1': 'in',
      '2': 'out',
      'in': '1',
      'out': '2',
      'Cu0': 'Cu0',
      'Cu1': 'Cu1'
    };
    return mapping[side];
  }
}

class ConnectionsTable {
  constructor(connectionsList) {
    this.table = connectionsList;
  }

  get(side, colour) {
    let result = [];
    this.table.forEach(e => {
      if ((e.mySide === side) && (e.colour === colour)) {
        result.push(e);
      }
    });
    return result;
  }

  add(connection) {
    // TODO validation & de-duplication
    // check that there is not already a matching connection
    this.table.push(connection);
  }
}

const Connections = (superclass) => class extends superclass {
    constructor() {
      super();
      this._connections = new ConnectionsTable([]);
    }

    connections() {
      return this._connections;
    }

    connectTo(otherEntity, mySide, theirSide, colour) {
      this._connections.add(new Connection(otherEntity, mySide, theirSide, colour));
      otherEntity._connections.add(new Connection(this, theirSide, mySide, colour));
    }

    fromObject(obj) {
      super.fromObject(obj);
      this._rawConnections = obj.connections;
    }

    updateConnections(entityNumberMap) {
      if (typeof this._rawConnections === 'undefined') return; // early exit for entities that have no connections.
      // Example _rawConnections
      // {
      //   '1': { red: [ { entity_id: 1 } ] },
      //   'Cu1': [ { entity_id: 3, wire_id: 0 } ] }
      // }
      const list = [];

      // function to parse the list of connected entities then create and store
      // the Connection objects. As a function because the arary to handle
      // can be located at different places in the object.
      const handleEntityConnectionList = (l, ms, ts, c) => {
        l.forEach(entityObj => {
          list.push(new Connection(entityNumberMap[entityObj.entity_id], ms, ts, c));
        });
      };

      // read the connections block and flatten to lists of connections
      Object.keys(this._rawConnections).forEach(side => {
        if (Array.isArray(this._rawConnections[side])) {
          // Cu0/1; copper connections; usually found in power switches.
          // XXX not sure what the wire_id field is for, so ignoring for now.
          handleEntityConnectionList(this._rawConnections[side], side, null);
        } else {
          // in(1)/out(2); usually red & green wires.
          Object.keys(this._rawConnections[side]).forEach(colour => {
            handleEntityConnectionList(this._rawConnections[side][colour], side, null, colour);
          });
        }
      });

      this._connections = new ConnectionsTable(list);
    }

    toObject() {
      const mine = {
        connections: {}
      };
      this._connections.table.forEach(c => {
        var arr;
        if (typeof c.colour === 'undefined') {
          if (typeof mine.connections[c.mySide] === 'undefined') mine.connections[c.mySide] = [];
          arr = mine.connections[c.mySide];
        } else {
          if (typeof mine.connections[c.mySide] === 'undefined') mine.connections[c.mySide] = {};
          if (typeof mine.connections[c.mySide][c.colour] === 'undefined') mine.connections[c.mySide][c.colour] = [];
          arr = mine.connections[c.mySide][c.colour];
        }
        arr.push({ entity_id: c.otherEntity.number() });
      });

      const sup = (super.toObject) ? super.toObject() : {};
      return {...sup, ...mine};
    }
  };

module.exports = Connections;
