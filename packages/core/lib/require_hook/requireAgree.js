const requireUncached = require("./requireUncached");

module.exports = (agree, hot = true) => {
  return hot ? requireUncached(agree) : require(agree);
};
