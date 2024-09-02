const { userSocketIDs } = require("..");

exports.getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));

  return sockets;
};
