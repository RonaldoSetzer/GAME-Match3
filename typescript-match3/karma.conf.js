process.env.TEST = true;
process.env.NODE_ENV = "test";

const webpack = require("webpack");
const path = require("path");
const webpackConfig = require("./webpack.config.js");

delete webpackConfig.entry;

module.exports = function(config) {
  var configuration = {
    basePath: "",
    frameworks: ["mocha", "chai", "sinon", "es6-shim"],
    files: [
      "./test/entry.test.ts",
      "./test/**/**/**.test.ts",
      {
        pattern: "**/*.map",
        served: true,
        included: false,
        watched: true
      }
    ],
    preprocessors: {
      "./**/**/**/**.ts": ["sourcemap"],
      "./test/**/**/**.test.ts": ["webpack"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      "karma-webpack",
      "karma-sourcemap-writer",
      "karma-sourcemap-loader",
      "karma-remap-istanbul",
      "karma-mocha-reporter",
      "karma-mocha",
      "karma-chai",
      "karma-sinon",
      "karma-es6-shim",
      "karma-coverage-istanbul-reporter"
    ],
    reporters: config.singleRun ? ["mocha", "coverage-istanbul"] : ["mocha"],
    coverageIstanbulReporter: {
      reports: ["html", "lcov", "lcovonly", "text-summary"],
      dir: "coverage",
      fixWebpackSourcePaths: true,
      "report-config": {
        html: {
          subdir: "html-report"
        }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"]
  };

  configuration.browsers = ["PhantomJS"];
  configuration.plugins.push("karma-phantomjs-launcher");

  config.set(configuration);
};
