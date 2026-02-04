const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'mapbox-gl': 'maplibre-gl'
  };
  return config;
};

