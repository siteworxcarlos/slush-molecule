/*
 * slush-molecule
 * https://github.com/siteworxcarlos/slush-molecule
 *
 * Copyright (c) 2016, Carlos Picart
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();
gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your molecule?',
        default: defaults.appName
    }, {
        type: 'list',
        name: 'appJs',
        message: 'Do you need a JS file created for the molecule?',
        choices: ['Yes', 'No'],
        default: 'Yes'
    }, {
        type: 'list',
        name: 'appData',
        message: 'Do you need a .json file created for the molecule?',
        choices: ['Yes', 'No'],
        default: 'Yes'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            answers.jsonName = answers.appName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });; //convert appname to json naming convention
            answers.jsName = answers.appName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });; //convert appname to js naming convention
            answers.jsName = answers.jsName.charAt(0).toUpperCase() + answers.jsName.slice(1); //capitalized first letter in js name

            if (answers.appData === "No"){
                gulp.src(__dirname + '/templates/index.mustache')
                    .pipe(template(answers))
                    .pipe(rename(function(file) {
                        file.basename = '00-'+answers.appName;
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('source/_patterns/01-molecules/'))
                    .pipe(install())
                    .on('end', function() {
                        done();
                    });
            }
            
            //output scss file in project directory
            gulp.src(__dirname + '/templates/app-sm.scss')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = '_'+answers.appName + "-sm";
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('source/css/scss/modules/'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });

            gulp.src(__dirname + '/templates/app-lg.scss')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = '_'+answers.appName + "-lg";
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('source/css/scss/modules/'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });
            
            //if JS needed create one and add to init.js
            if (answers.appJs === "Yes"){
                gulp.src(__dirname + '/templates/*.js')
                    .pipe(template(answers))
                    .pipe(rename(function(file) {
                        file.basename = answers.appName;
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('source/js/modules/'))
                    .pipe(install())
                    .on('end', function() {
                        done();
                    });
                
                gulp.src('source/js/init.js')
                    .pipe(replace('//Scaffold JS','$(\'[data-comp=\"'+answers.appName+'\"]\').each(function(){\n\t\tnew'+answers.jsName+' = new project.Comp.'+answers.jsName+'({\n\t\t\t$el:$(this),\n\t\t});\n\t});\n\t//Scaffold JS'))            
                    .pipe(gulp.dest('source/js/'))
                    .pipe(install())
                    .on('end', function() {
                        done();
                    });
                
            }

            //if .json needed create one
            if (answers.appData === "Yes"){
                gulp.src(__dirname + '/templates/*.json')
                    .pipe(template(answers))
                    .pipe(rename(function(file) {
                        file.basename = answers.appName;
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('source/_data/modules/'))
                    .pipe(install())
                    .on('end', function() {
                        done();
                    });

                gulp.src(__dirname + '/templates/index-data.mustache')
                    .pipe(template(answers))
                    .pipe(rename(function(file) {
                        file.basename = '00-'+answers.appName;
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('source/_patterns/01-molecules/'))
                    .pipe(install())
                    .on('end', function() {
                        done();
                    });
            }
            
            //update scss file
            gulp.src('source/css/*.scss')
                .pipe(replace('//scaffold-mobile','@import "scss/modules/'+answers.appName+'/'+answers.appName+'-sm";\n//scaffold-mobile'))
                .pipe(replace('//scaffold-desktop','@import "scss/modules/'+answers.appName+'/'+answers.appName+'-lg";\n//scaffold-desktop'))
                .pipe(gulp.dest('source/css/'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
            

        });
});
