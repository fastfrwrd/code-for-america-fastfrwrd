module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 1338,
          open: {
            target: 'http://localhost:1338/public/index.html', // target url to open
            appName: 'open' // name of the app that opens, ie: open, start, xdg-open
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('server', ['connect:server:keepalive']);
};
