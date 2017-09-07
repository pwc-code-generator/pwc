'use strict';

const 
    yaml = require('js-yaml'),
    fs = require('fs'),
    filter = require('./filter');

var project = {
    init: function(commands) {
        this.commands = commands;
        this.loadProjectFile();
        this.filterProject();

        return this.project;
    },

    loadProjectFile: function() {
        this.parsedProject = yaml.safeLoad(fs.readFileSync(this.commands.getFile(), 'utf8'));
        
        if(!this.parsedProject)
            throw 'The file ' + this.commands.getFile() + ' has no data or the data is invalid/corrupted. Please verify!';
    },

    filterProject: function() {
        this.project = filter.init(this.commands, this.parsedProject);
    }
}

module.exports = project;