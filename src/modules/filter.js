'use strict';

const
    // Classes
    Project = require('../classes/Project'),
    Model = require('../classes/Model');

var filter = {

    init: function(commands, parsedProject) {
        this.commands = commands;
        this.parsedProject = parsedProject;
        this.project = new Project();

        this.filterName();
        this.initModels();
        this.enrichRelationships();
        
        return this.project;
    },

    filterName: function() {
        let name = this.parsedProject.name || this.commands.getName();
        if(!name)
            throw 'Please inform the project/module name!';

        this.project.setName(name);
    },

    initModels: function() {
        this.validateParsedProjectHasModels();

        Object.keys(this.parsedProject.models).map((modelName, index) => {
            let parsedModel = this.parsedProject.models[modelName];
            
            // Index used to indentify the model
            parsedModel.index = index;
            parsedModel.name = modelName;
            let model = new Model(parsedModel);

            this.project.addModel(model);
        });
    },

    validateParsedProjectHasModels: function() {
        if(!this.parsedProject.models || this.parsedProject.models.length == 0)
            throw 'The project has no models to generate de code. Please verify your ' 
            + this.commands.getFile() + ' file';
    },

    enrichRelationships: function() {
        this.project.getModels().forEach((model) => {
            model.relationships.forEach((relationship) => {
                let relatedModel = this.project.getModelByName(relationship.name);
                relationship.setRelatedModel(relatedModel);
            });
        });
    },

};

module.exports = filter;