var cp = require("child_process");

module.exports = function(grunt) {
  grunt.initConfig({
    replace: {
      build: {
        options: {
          variables: {
            "script": "<%= grunt.file.read('script.js') %>"
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

  grunt.registerTask("browserify", function() {
    cp.exec("node_modules/.bin/browserify -r ./components/marked/index.js:marked > test/script.js", this.async());
  });

  grunt.registerTask("inline", function() {
    cp.exec("node_modules/.bin/inliner component.html > index.html", this.async());
  });

  grunt.registerTask("build", ["replace"]);
  grunt.registerTask("test", ["build", "browserify", "karma", "watch:build"]);
}
