import Sequelize from 'sequelize';
import bluebird from 'bluebird';
import shortid from 'shortid';
import bcrypt from 'bcrypt';

import database from '../database';

const hash = bluebird.promisify(bcrypt.hash);

const User = database.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true,
    defaultValue() {
      return shortid.generate();
    },
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: true,
      len: [8, 32],
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      len: [8, 128],
    },
  },
}, {
  instanceMethods: {
    // Check if a password matches
    checkPassword(password) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isValid) => {
          if (err) {
            reject(err);
          } else {
            if (isValid) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        });
      });
    },
  },
});

// Encrypt password with bcrypt
User.beforeCreate((user, options) => (
  hash(user.password, 12).then((hashedPass) => {
    user.setDataValue('password', hashedPass);
    return options;
  })
));

export default User;
