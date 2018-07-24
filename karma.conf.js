
module.exports = function(config) {
  config.set({

    browsers: [ 'ChromeHeadless' ],
    // browsers: [ 'Chrome' ],
    // browsers: [ 'Chrome', 'Firefox', 'Safari' ],

    files: [
      { pattern: '*.test.js', included: true, served: false, watched: true },
      { pattern: '*.+(js|css|less)', included: false, served: false, watched: true },
    ],

    plugins: [ 'karma-*', require('./karma-codex-framework.js') ],
    frameworks: [ 'codex', 'mocha', 'chai', 'sinon' ],
    reporters: [ 'mocha' ],
    mochaReporter: { showDiff: true },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%m', // '%b %t: %m',
      terminal: true,
    },

  })
}
