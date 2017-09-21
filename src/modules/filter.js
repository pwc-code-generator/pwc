'use strict';

const
    richModel = require('./richModel');

var filter = {
    init: function(commands, parsedProject) {
        this.commands = commands;
        this.parsedProject = parsedProject;
        this.project = {models: []};

        this.filterName();
        this.initModels();
        
        return this.project;
    },

    filterName: function() {
        this.project.name = this.parsedProject.name || this.commands.getName();
        if(!this.project.name)
            throw 'Please inform the project/module name!';
    },

    initModels: function() {
        this.validateProjectHasModels();

        Object.keys(this.parsedProject.models).map((modelName, index) => {
            let parsedModel = this.parsedProject.models[modelName];
            parsedModel.index = index;
            let model = richModel.init(modelName, parsedModel);
            this.project.models.push(model);
        });
    },

    validateProjectHasModels: function() {
        if(!this.parsedProject.models || this.parsedProject.models.length == 0)
            throw 'The project has no models to generate de code. Please verify your ' 
            + this.commands.getFile() + ' file';
    }
};

module.exports = filter;