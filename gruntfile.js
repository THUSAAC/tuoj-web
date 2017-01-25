'use strict';
var angularFiles = [ 'client/bower_components/angular/angular.min.js', 
	'client/bower_components/angular-ui-router/release/angular-ui-router.min.js' ];
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.initConfig({
        nodemon: {
            dev: {
                script: './bin/www',
                callback: function(nodemon) {
                    nodemon.on('log', function(event) {
                        console.log(event.colour);
                    });
                },
                env: {},
                cwd: __dirname,
                ext: 'js',
                watch: [ 'api', 'modules', 'app.js', 'index.js' ],
                delay: 1000,
                legacyWatch: true
            }
        },
		concat: {
			dev: {
				files: {
					'client/dists/lib.angular.js': angularFiles,
					'client/dists/router.js': [ 'client/router/*' ],
					'client/dists/controller.js': [ 'client/modules/*' ],
				}
			}
		},
		watch: {
			files: [ 'client/*.js' ],
			tasks: [ 'concat' ]
		},
		concurrent: {
			dev: [
				[ 'concat', 'watch'],
				[ 'nodemon' ]
			],
			options: {
				logCurrentOutput: true
			}
		}
    });
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', [ 'concat', 'nodemon' ]);
    grunt.registerTask('fg', [ 'concat', 'watch' ]);
};
