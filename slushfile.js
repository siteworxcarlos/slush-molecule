/*
 * slush-molecule
 * https://github.com/siteworxcarlos/slush-molecule
 *
 * Copyright (c) 2016, Carlos Picart
 * Licensed under the MIT license.
 */
var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    prettify = require('gulp-jsbeautifier'),
    del = require("del"),
    fs = require("fs"),
    objectMerge = require('object-merge'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path'),
    config = {},
    latestAnswers = null;

(function getConfig() {
    try {
        config = require(process.cwd() + '/slush-molecule-config.json'); // Try to get local-to-project config file
    } catch(e) {
        // No local config file
    }

    var globalConfig = require('./slush-molecule-config.json'); // Fall back to generic configs

    config = objectMerge(globalConfig, config);
})();

gulp.task('refreshAnswers', function(done) {
    var prompts = [{
            name: 'appName',
            message: 'What is the name of your molecule?',
            validate: function(val) {
                if(val && val.length > 0) { return true; }
                return 'Please provide a name to use for your molecule.';
            }
        },{
            name: 'folder',
            message: 'What folder should the molecule pattern (mustache) be stored in?',
            default: function(answers) {
                return '00-'+answers.appName;
            }
        },{
            name: 'orderNumber',
            message: 'What order should this molecule be in, in that folder? (ex. 00 is first)',
            default: '00'
        },{
            name: 'htmlWrapper',
            message: 'What kind of HTML tag should be wrapping your molecule?',
            default: 'div'
        },{
            type: 'list',
            name: 'appJs',
            message: 'Do you need a JS file created for the molecule?',
            choices: ['Yes', 'No'],
            default: 'Yes'
        },{
            type: 'list',
            name: 'appData',
            message: 'Do you need a .json (i.e. data) file created for the molecule?',
            choices: ['Yes', 'No'],
            default: 'Yes'
        }
    ];
    //Ask
    inquirer.prompt(prompts, function (answers) {
        answers.appNameSlug = _.slugify(answers.appName);
        answers.jsonName = answers.appName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); //convert appname to json naming convention
        answers.jsName = answers.appName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); //convert appname to js naming convention
        answers.jsName = answers.jsName.charAt(0).toUpperCase() + answers.jsName.slice(1); //capitalized first letter in js name

        answers.appJs = answers.appJs === "Yes" ? true : false;
        answers.appData = answers.appData === "Yes" ? true : false;

        latestAnswers = answers;
        gulp.start('createFiles'); // NOTE: Will be deprecated in gulp 4.0
        done();
    });
});

function haveAnswers() {
    if(!latestAnswers) {
        console.error('Need to run task `refreshAnswers` before creating files');
        return false;
    }

    return true;
}

gulp.task('createPattern', function(done) {
    if(!haveAnswers()) { return; }

    var templatePath = "";
    if(latestAnswers.appData) {
        templatePath = (config.mustacheDataFile.slushTemplate ? __dirname : '') + config.mustacheDataFile.template;
    } else {
        templatePath = (config.mustacheFile.slushTemplate ? __dirname : '') + config.mustacheFile.template;
    }

    //output mustache file in project directory
    return gulp.src(templatePath)
        .pipe(template(latestAnswers))
        .pipe(rename(function(file) {
            file.basename = latestAnswers.orderNumber + '-' + latestAnswers.appName;
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest(config.mustacheOutputPath + latestAnswers.folder))
        .pipe(install());
});

var scssFileTasks = [],
    lastScssImportTask = null;
(function () {
    for(var i = 0; i < config.scssFiles.length; i++) {
        var fileInfo = config.scssFiles[i],
            taskName = 'createScssFile-' + i;

        createScssFileTask(fileInfo, taskName);
        scssFileTasks.push(taskName);

        // Since these all are potentially writing to the same file, make each one dependent on the last one completing
        // only need to track the name of the last one to trigger the whole chain
        taskName = 'importScssFile-' + i;
        createScssImportTask(fileInfo, taskName, (i === 0 ? null : ['importScssFile-' + (i - 1)]));
        lastScssImportTask = taskName;
    }
})();
function createScssFileTask(fileInfo, taskName) {
    gulp.task(taskName, function(done) {
        if(!haveAnswers()) { return; }

        var src = fileInfo.slushTemplate ? __dirname + fileInfo.template : fileInfo.template,
            filename = latestAnswers.appName + config.scssNamespaceConnector + fileInfo.name;

        // Output folder with scss files in project directory
        return gulp.src(src)
            .pipe(template(latestAnswers))
            .pipe(rename(function(file) {
                file.basename = "_" + filename;
            }))
            .pipe(conflict(config.scssFileOutputPath + latestAnswers.appName))
            .pipe(gulp.dest(config.scssFileOutputPath + latestAnswers.appName))
            .pipe(install());
    });
}

function createScssImportTask(fileInfo, taskName, prevTask) {

    // NOTE: Will be deprecated in gulp 4.0 - use series instead
    if(prevTask !== null) { gulp.task(taskName, prevTask, task); }
    else { gulp.task(taskName, task); }

    function task(done) {
        if(!haveAnswers()) { return; }

        var filename = latestAnswers.appName + config.scssNamespaceConnector + fileInfo.name,
            dirName = fileInfo.includedFromFile.substring(0, fileInfo.includedFromFile.lastIndexOf("/")),
            replacing = (fileInfo.importReplace ? true : false),
            importStr = '@import "' + fileInfo.scssImportPath + latestAnswers.appName + '/' + filename + '";';

        // Update the scss file that includes this new file
        return gulp.src(fileInfo.includedFromFile)
            // Prepend the placeholder text with the new import
            .pipe(gulpif(replacing, replace(fileInfo.importReplace,importStr+'\n'+fileInfo.importReplace)))
            // Appending the new import
            .pipe(gulpif(!replacing, insert.append('\n'+importStr)))

            .pipe(gulp.dest(dirName))
            .pipe(install());
    }
}

gulp.task('createJSFile', function(done) {
    if(!haveAnswers() || !latestAnswers.appJs) { return; }

    var templatePath = (config.jsFile.slushTemplate ? __dirname : '') + config.jsFile.template;

    // Create the JS file
    return gulp.src(templatePath)
        .pipe(template(latestAnswers))
        .pipe(rename(function(file) {
            file.basename = latestAnswers.appName;
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest(config.jsFile.outputPath))
        .pipe(install());
});

gulp.task('initJSFile', ['createInitScript'], function() {
    // NOTE: Assuming that something else is concatinating and loading the JS files, this simply initializes it

    if(!haveAnswers() || !latestAnswers.appJs) { return; }

    var initDirName = config.jsInitScript.initializedFromFile.substring(0, config.jsInitScript.initializedFromFile.lastIndexOf("/") + 1),
        initScriptPath = process.cwd() + '/' + initDirName + config.jsInitScript.tempFilename,
        initScript = fs.readFileSync(initScriptPath, "utf8"),
        replacing = (config.jsInitScript.initializeReplace ? true : false);

    return gulp.src(config.jsInitScript.initializedFromFile)

        // Prepend the placeholder text with the new init code
        .pipe(gulpif(replacing, replace(config.jsInitScript.initializeReplace,initScript + '\n' + config.jsInitScript.initializeReplace)))
        // Appending the new init code
        .pipe(gulpif(!replacing, insert.append('\n'+initScript)))

        .pipe(prettify()) // Prettifying the file, since a script has been added from elsewhere, the indentation probably got messed up
        .pipe(gulp.dest(initDirName))
        .pipe(install())
        .on('end', function() {
            del(initScriptPath); // Delete the temporary file as it is no longer needed
        });
});

// Create a temporary file for the initialization script (to be added to the initialization file)
gulp.task('createInitScript', function() {
    if(!haveAnswers() || !latestAnswers.appJs) { return; }

    var templatePath = (config.jsInitScript.slushTemplate ? __dirname : '') + config.jsInitScript.template,
        initDirName = config.jsInitScript.initializedFromFile.substring(0, config.jsInitScript.initializedFromFile.lastIndexOf("/") + 1);

    return gulp.src(templatePath)
        .pipe(template(latestAnswers))
        .pipe(rename(function(file) {
            file.basename = config.jsInitScript.tempFilename.split('.')[0];
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest(initDirName));
});

gulp.task('createDataFile', function() {
    if(!haveAnswers() || !latestAnswers.appData) { return; }

    var templatePath = (config.dataFile.slushTemplate ? __dirname : '') + config.dataFile.template;

    return gulp.src(templatePath)
        .pipe(template(latestAnswers))
        .pipe(rename(function(file) {
            file.basename = latestAnswers.appName;
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest(config.dataFile.outputPath))
        .pipe(install());
});

// NOTE: Will be deprecated in gulp 4.0, use series and/or parallel instead
gulp.task('createFiles',['createPattern', 'createJSFile', 'initJSFile', 'createDataFile', lastScssImportTask].concat(scssFileTasks));
gulp.task('default', ['refreshAnswers']);
