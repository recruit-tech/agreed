
function getRandom(min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (min > max) {
    max = min;
    min = 0;
  }
  return Math.trunc(Math.random() * (max - min) + min);
}

function randomInt(value) {
  if (typeof value === 'number') {
    return getRandom(value);
  }
  const matched = value.match(/(\d+)-(\d+)/);
  if (!matched) {
    return getRandom();
  }
  const min = matched[1];
  const max = matched[2];
  return getRandom(min, max);
}

module.exports = randomInt;
