function isObject(any) {
  return typeof any === "object" && any && !Array.isArray(any);
}

function getObjectSimilarity(obj1, obj2) {
  let numberOfKeys = 0;
  let numberOfMatches = 0;
  if (!isObject(obj1)) return [numberOfKeys, numberOfMatches];
  Object.entries(obj1).forEach(([key, value]) => {
    numberOfKeys++;
    if (!isObject(obj2)) return;
    if (obj2.hasOwnProperty(key)) {
      numberOfMatches++;
    }
    if (isObject(value) && isObject(obj2[key])) {
      const [k, m] = getObjectSimilarity(value, obj2[key]);
      numberOfKeys += k;
      numberOfMatches += m;
    }
  });
  return [numberOfKeys, numberOfMatches];
}
module.exports = getObjectSimilarity;
