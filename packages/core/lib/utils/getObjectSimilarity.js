function isObject(any) {
  return typeof any === "object" && any && !Array.isArray(any);
}

function getObjectSimilarity(obj1, obj2) {
  if (!isObject(obj1)) return [0, 0];

  const keys = Object.keys(obj1);
  let numberOfKeys = keys.length;

  if (!isObject(obj2)) return [numberOfKeys, 0];

  let numberOfMatches = 0;
  keys.forEach((key) => {
    if (obj2.hasOwnProperty(key)) numberOfMatches++;

    const [k, m] = getObjectSimilarity(obj1[key], obj2[key]);
    numberOfKeys += k;
    numberOfMatches += m;
  });
  return [numberOfKeys, numberOfMatches];
}
module.exports = getObjectSimilarity;
