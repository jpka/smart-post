var cp = require("child_process");

module.exports = function(grunt) {
  grunt.initConfig({
    replace: {
      build: {
        options: {
          variables: {
            "proto": "<%= grunt.bundle %>"
          }
        },
        files: [
          {src: ["component.html"], dest: "./index.html"}
        ]
      }
    },
    watch: {
      build: {
        files: ["script.js", "component.html"],
        tasks: ["build"]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-replace");

  grunt.registerTask("karma", function() {
    cp.spawn("node_modules/.bin/karma", ["start"], {stdio: "inherit"});
  });

  grunt.registerTask("browseriglify", function() {
    var done = this.async();
    cp.exec("node_modules/.bin/browserify -r ./proto.js:proto | node_modules/.bin/uglifyjs -c -m", function(err, stdout) {
      grunt.bundle = stdout;
      done();
    });
  });

  grunt.registerTask("build", ["browseriglify", "replace"]);
  grunt.registerTask("test", ["build", "karma", "watch:build"]);
}
