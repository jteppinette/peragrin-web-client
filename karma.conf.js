module.exports = function(config) {
  return config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        'bower_components/fastclick/lib/fastclick.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-http-auth/src/http-auth-interceptor.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'public/templates.js',
        'public/app.js',
        'src/**/*.spec.js'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['progress'],
    client: {
        captureConsole: true
    },
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
