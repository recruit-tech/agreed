module.exports = (module, hot = true) => {
  if (hot) delete require.cache[require.resolve(module)];
  return require(module);
};
