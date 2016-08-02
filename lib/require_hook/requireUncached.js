module.exports = (module) => {
    delete require.cache[require.resolve(module)]
    return require(module)
};
