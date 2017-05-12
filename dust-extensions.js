module.exports = function(dust){
  const dustHelpers = {
    testToUpper: function (chunk, context, bodies, params) {
      return chunk.tap(function(data) {
        return data.toUpperCase();
      }).render(bodies.block, context).untap();
    },
  };

  const dustFilters = {
    testToUpper: function(val) {
      return val.toUpperCase();
    },
  };

  Object.assign(dust.helpers, dustHelpers);
  Object.assign(dust.filters, dustFilters);

  return dust;
};
