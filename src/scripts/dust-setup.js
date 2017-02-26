var dustFilters = {
  testToUpper: function(value) {
    return value.toUpperCase();
  },
};

var dustHelpers = {
  testToUpper: function (chunk, context, bodies, params) {
    return chunk.tap(function(data) {
      return data.toUpperCase();
    }).render(bodies.block, context).untap();
  },
};

var setupHelpers = function(dust) {
  Object.assign(dust.helpers, dustHelpers);
};

var setupFilters = function(dust) {
  Object.assign(dust.filters, dustFilters);
};

var setup = function(dust, isDev) {
  var dustLog = dust.log;

  if (isDev) {
    // wrap the existing log function to also log on the front end.
    dust.log = function(msg, level) {
      console.log(`[DUST:${level}]: ${msg}`);
      dustLog.apply(this, arguments);
    };

    dust.debugLevel = 'DEBUG';
  }

  setupHelpers(dust);
  setupFilters(dust);
};

// Make Client and Server Compatible
if (typeof exports !== 'undefined') {
  module.exports = {
    setup: setup,
  };
} else if (!!window) {
  setup(window.dust, window.appData.isDev);
}