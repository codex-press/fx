// NOTE! after npm install you must comment out line 165 of file:
// node_modules/karma-systemjs/lib/adapter.js
// 
// That package is basically a piece of crap and no longer maintained...

module.exports = function(config) {
  config.set({

    basePath: './',

    frameworks: [ 'systemjs', 'mocha', 'chai', 'sinon' ],

    files: [
      '*.test.js',
      // 'src/**/*.test.js',
      // 'src/*.test.js',
      // 'core/**/*.test.js',
      // 'core/*.test.js',
      { pattern: '*.js', included: false },
      // { pattern: 'src/**/*.js', included: false },
      // { pattern: 'lib/**/*.js', included: false },
      // { pattern: 'core/**/*.js', included: false },
      { pattern: 'node_modules/systemjs-plugin-babel/**/*.js', included: false },
    ],

    proxies: {
      '/app': 'http://localhost:8000/app',
      '/parent': 'http://localhost:8000/parent'
    },

    exclude: [
      'node_modules/',
    ], 

    preprocessors: { },

    systemjs: {

      config: {

        transpiler: 'plugin-babel',

        paths: {
          'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
          'es-module-loader': 'node_modules/es-module-loader/dist/es-module-loader.js',
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
          'babel-plugin-transform-react-jsx': 'node_modules/babel-plugin-transform-react-jsx/lib/index.js'
        },

      }
    },

    reporters: [ 'mocha' ],

    mochaReporter: { showDiff: true },

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [ 'ChromeHeadless' ],
    //browsers: [ 'Chrome' ],
    // browsers: [ 'Chrome', 'Firefox', 'Safari' ],

    client: {
      captureConsole: true,
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%m', //'%b %t: %m',
      terminal: true,
    },

    singleRun: false,
    concurrency: Infinity,

  })

}