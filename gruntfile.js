'use strict';
var angularFiles = [ 'client/bower_components/angular/angular.min.js', 
	'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
	'client/bower_components/oclazyload/dist/ocLazyLoad.min.js',
];
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.initConfig({
        nodemon: {
            dev: {
                script: './server/config/exec.js',
                callback: function(nodemon) {
                    nodemon.on('log', function(event) {
                        console.log(event.colour);
                    });
                },
				options: {
					env: { },
					cwd: __dirname,
					ext: 'js',
					watch: [ 'server/*' ],
	                delay: 1000,
					legacyWatch: true
				}
            }
        },
		concat: {
			dev: {
				files: {
					'client/dists/router.js': [ 'client/router/*' ],
					'client/dists/controller.js': [ 'client/modules/*/*.js' ],
				}
			}, lib: {
				files: {
					'client/dists/lib.angular.js': angularFiles,
				}
			}
		},
		watch: {
			dev: {
				files: [ 'client/router/*.js', 'client/modules/*/*.js' ],
				tasks: [ 'concat:dev' ]
			}
		},
		concurrent: {
			dev: {
				tasks: [ 'concat', 'watch', 'nodemon' ],
				options: {
					logConcurrentOutput: true
				}
			}
		}
    });
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', [ 'concurrent' ]);
};
