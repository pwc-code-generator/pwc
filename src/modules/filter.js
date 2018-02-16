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
        this.orderModels();

        this.project.setIndex(parsedProject.index);
        
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
            
            parsedModel.name = modelName;
            let model = new Model(parsedModel);

            this.project.addModel(model);
        });
    },

    validateParsedProjectHasModels: function() {
        if(!this.parsedProject.models || this.parsedProject.models.length == 0)
            throw 'The project has no models to generate the code. Please verify your ' 
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

    /**
     * This method is used to order the models based in your relationships. Eg: With a model "PARENT" and a model "CHILD",
     * the "PARENT" model needs to always run before the "CHILD" model. Otherwise, the database generation can broken.
     */
    orderModels: function() {
        console.log('Ordering models...'.blue.bold);

        this.project.getModels().sort((firstModel, secondModel) => {

            // First model belongs to secondModel
            if(firstModel.belongsTo(secondModel)) {
                return 1; // Send firstModel to end
            }

            if(secondModel.belongsTo(firstModel)) {
                return -1; // Send firstModel to start
            }

            return 0;

        });

        this.setNewModelsIndex();
    },

    setNewModelsIndex: function() {
        this.project.getModels().forEach((model, index) => {
            model.index = index;
        });
    },

    showAllModelNames: function() {
        this.project.getModels().forEach((model) => {
            console.log('Model ' + model.index + ': ' + model.getName());
        });
    }

};

module.exports = filter;