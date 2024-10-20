const users = [];

//join usre chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find((u) => u.id === id);
}

//user leave chat
function userLeave(id) {
  const i = users.findIndex((u) => u.id === id);
  if (i !== -1) {
    return users.splice(i, 1)[0];
  }
}

//getroom users
function getRoomUsers(room) {
  return users.filter((u) => u.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
