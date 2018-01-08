'use strict';

const
    // Classes
    Template = require('./Template');

class Util {

    constructor() {
        this.pathManager = require('path');
        this.fileManager = require('fs');
        this.shellManager = require('shelljs');
        this.fileCopyManager = require('ncp');
    }

    testDependency(dependency, message) {
        if (!this.shellManager.which(dependency)) {
            throw message || 'Sorry, this generator requires "' + dependency + '" installed in your system';
            this.shellManager.exit(1);
        }
    }

    executeCommand(command, callback) {
        console.log('Running "' + command.yellow + '"');
        this.shellManager.exec(command, callback);
    }

    goToFolder(folder) {
        this.shellManager.cd(folder);
    }

    /**
    * Get a file, proccess it with data and return the content
    * - fileName - The file name and path in case of external file
    * - data - The data that the doT engine will proccess
    */
    getContentFromTemplate(fileName, data = {}) {
        let fileContent = this.fileManager.readFileSync(fileName, 'utf8');
        var template = new Template(fileContent).compile(data);
        return template;
    }

    makeFileFromTemplate(destFilePath, templateFilePath, data = {}) {
        let content = this.getContentFromTemplate(templateFilePath, data);
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

    writeFile(destFilePath, content, message) {
        let customMessage = message || 'Writing File: ';
        console.log(customMessage.green.bold + destFilePath);
        this.makeDirectoryIfNotExists(destFilePath);
        return this.fileManager.writeFileSync(destFilePath, content);
    }

    deleteFile(destFilePath) {
        if(this.fileManager.existsSync(destFilePath)) {
            console.log('Removing File: '.yellow.bold + destFilePath);
            return this.fileManager.unlinkSync(destFilePath);
        }

        return false;
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