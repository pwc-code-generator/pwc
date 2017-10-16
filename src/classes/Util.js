'use strict';

const
    handlebarsMathHelpers = require('handlebars-helpers').math();

class Util {

    constructor() {
        this.pathManager = require('path');
        this.fileManager = require('fs');
        this.shellManager = require('shelljs');
        this.templateManager = require('handlebars');
        this.fileCopyManager = require('ncp');

        this.setupSettings();
    }

    setupSettings() {
        
        let customHelpers = {

            equal: function(v1, v2) {
                return v1 == v2;
            },

            lengthEqual: function(array, length) {
                return array.length == length;
            },

            lengthLessThan: function(array, length) {
                return array.length < length;
            },

            lengthGreaterThan: function(array, length) {
                return array.length > length;
            },
            
            /**
             * Returns if the first argument matches the other arguments list
             * @return boolean
             */
            in: function () {
                let isEqual = false;
                if(arguments.length < 2)
                    throw 'The template equal function needs two or more arguments!';

                let firstArgument = arguments[0];

                for (var i = 1; i < arguments.length; i++) {
                    if(firstArgument == arguments[i]) isEqual = true;
                }

                return isEqual;
            }
        };

        // Register all the Handlebars Helpers (Custom)
        this.templateManager.registerHelper(Object.assign(customHelpers, handlebarsMathHelpers));
    }

    testDependency(dependency, message) {
        if (!this.shellManager.which(dependency)) {
            throw message || 'Sorry, this generator requires "' + dependency + '" installed in your system';
            this.shellManager.exit(1);
        }
    }

    executeCommand(command, callback) {
        this.shellManager.exec(command, callback);
    }

    goToProjectFolder(project) {
        this.goToFolder(project.name);
    }

    goToFolder(folder) {
        this.shellManager.cd(folder);
    }

    /**
    * Get a file, proccess it with variables and return the content
    * - fileName - The file name and path in case of external file
    * - variables - The variables that the doT engine will proccess
    */
    getContentFromTemplate(fileName, variables = {}) {
        let fileContent = this.fileManager.readFileSync(fileName, 'utf8');
        var template = this.templateManager.compile(fileContent);
        return template(variables);
    }

    makeFileFromTemplate(destFilePath, templateFilePath, variables = {}) {
        let content = this.getContentFromTemplate(templateFilePath, variables);
        return this.writeFile(destFilePath, content);
    }

    /**
     * Makes a folder based on a folder template (copy the folder)
     * @param  string destinationFolder
     * @param  string templateFolder
     * @return boolean
     */
    makeFolderFromTemplate(destinationFolder, templateFolder) {
        console.log('Creating Directory inside: '.blue.bold + destinationFolder);
        return this.shellManager.cp('-R', templateFolder, destinationFolder);
    }

    writeFile(destFilePath, content) {
        console.log('Writing File: '.green.bold + destFilePath);
        this.makeDirectoryIfNotExists(destFilePath);
        return this.fileManager.writeFileSync(destFilePath, content);
    }

    makeDirectoryIfNotExists(filePath) {
        var directoryName = this.pathManager.dirname(filePath);
        if (this.fileManager.existsSync(directoryName)) {
            return true;
        }
        this.makeDirectoryIfNotExists(directoryName);
        this.fileManager.mkdirSync(directoryName);
    }

    /**
     * Get a existent file passing the content to the callback to manipulate it
     * @param  {string}   fileNamePath File that will be manipulated
     * @param  {Function} callback     The callback that you receive the code and can manipulate it
     * @return {boolean}    Returns if the file was saved
     */
    manipulateFile(fileNamePath, callback) {
        let fileContent = this.fileManager.readFileSync(fileNamePath, 'utf8');

        if(callback) {
            fileContent = callback(fileContent);
        }
        
        return this.writeFile(fileName, fileContent);
    }

}

module.exports = Util;