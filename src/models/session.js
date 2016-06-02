import Sequelize from 'sequelize';
import shortid from 'shortid';

import database from '../database';

const Session = database.define('session', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true,
    defaultValue() {
      return shortid.generate();
    },
  },
});

export default Session;
