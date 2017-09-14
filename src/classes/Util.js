'use strict';

class Util {

    constructor() {
        this.pathManager = require('path');
        this.fileManager = require('fs');
        this.shellManager = require('shelljs');
        this.templateManager = require('handlebars');
        this.fileCopyManager = require('ncp');
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

}

module.exports = Util;