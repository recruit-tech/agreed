
function getRandom(length = 5) {
  var char = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charLength = char.length;
  var random = '';

  for (var i = 0; i < length; i++) {
    random += char[Math.floor(Math.random() * charLength)];
  }
  return random;
}

function randomString(value) {
  if (typeof value === 'number') {
    return getRandom(value);
  }
  return getRandom();
}

module.exports = randomString;
