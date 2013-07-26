
module.exports = function(grunt) {

    grunt.initConfig({

        connect: {
            test: {
                options: {
                    host: "localhost",
                    port: 8000,
                    base: "."
                }
            }
        },

        jasmine: {
            requirejs: {
                options: {
                    specs: "spec/*.spec.js",
                    helpers: "spec/setup.js",
                    vendor: [
                        'src/js/libs/jquery-1.9.1.min.js',
                        'src/js/libs/underscore-min.js'
                    ],
                    host: "http://127.0.0.1:8000/",
                    template: require("grunt-template-jasmine-requirejs"),
                    templateOptions: {
                        requireConfigFile: "src/config.js",
                        requireConfig: {
                            baseUrl: "src/js",
                            paths: {
                                "fixtures": "../../spec/fixtures",
                                "stubit": "../../spec/stubit"
                            }
                        }
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

    grunt.registerTask("test", ["connect:test", "jasmine:requirejs"]);

};
