/*jshint node:true*/
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, [ 'grunt-*', 'intern-geezer' ]);
    var path = require('path');

    var stripComments = /<\!--.*?-->/g,
        collapseWhiteSpace = /\s+/g;

    grunt.initConfig({
        dojo: {
            dist: {
                options: {
                    dojo: path.join('src', 'dojo', 'dojo.js'),
                    dojoConfig: path.join('src', 'dojoConfig.js'),
                    profile: path.join('profiles', 'dist.profile.js'),
                    releaseDir: path.join('..', 'dist'),
                    basePath: path.join(__dirname, 'src')
                }
            }
        },
        copy: {
            config: {
                options: {
                    processContent: function (content) {
                        return content.replace(/isDebug:\s+(true|1),?\s+/, '');
                    }
                },
                files: [
                    {
                        src: path.join('src', 'dojoConfig.js'),
                        dest: path.join('dist', 'dojoConfig.js')
                    }
                ]
            },
            index: {
                options: {
                    processContent: function (content) {
                        return content
                            .replace(stripComments, '')
                            .replace(collapseWhiteSpace, ' ')
                            ;
                    }
                },
                files: [
                    {
                        src: path.join('src', 'index.html'),
                        dest: path.join('dist', 'index.html')
                    }
                ]
            },
            resources: {
                files: [
                    {
                        expand:true,
                        cwd: path.join('src','resources'),
                        src: path.join( '**'),
                        dest: path.join('dist', 'resources')
                    }
                ]
            }
        },
        connect: {
            options: {
                port: 8888,
                hostname: 'localhost'
            },
            test: {
                options: {
                    base: 'src'
                }
            },
            dist: {
                options: {
                    base: 'dist'
                }
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            'dist'
                        ]
                    }
                ]
            }
        },
        intern: {
            local: {
                options: {
                    runType: 'client',
                    config: 'src/app/tests/intern'
                }
            },
            remote: {
                options: {
                    runType: 'runner',
                    config: 'src/app/tests/intern'
                }
            }
        }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            'connect:test:keepalive'
        ]);
    });
    grunt.registerTask('build', [ 'clean', 'dojo:dist', 'copy' ]);
};
