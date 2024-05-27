const path = require('path');
module.exports = function ({ env }) {
  return {
    webpack: {
     
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.output.publicPath =
          process.env.CDN_URL || webpackConfig.output.publicPath;
        return webpackConfig;
      }
    }
  };
};
