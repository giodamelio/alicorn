import User from './user';
import Session from './session';

// Setup relationships
User.hasMany(Session);
Session.belongsTo(User);

export { User, Session };
