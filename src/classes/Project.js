'use strict';

const
    // Classes
    Util = require('./Util');

class Project {

    constructor() {
        try{
            this.initAttributes();
        }catch(e){
            console.log(e.stack);
            throw 'Problem with the Project: '.red + e.red;
        }
    }

    initAttributes() {
        this.models = [];
        this.utils = new Util();
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setModels(models) {
        this.models = models;
    }

    getModels() {
        return this.models;
    }

    addModel(model) {
        this.models.push(model);
    }

    getModelByName(name) {
        let foundModel = null;

        this.models.forEach((model) => {
            if(model.name == name) {
                foundModel = model;
            }
        });

        return foundModel;
    }

    createGenerationFile() {
        let generation = {
            generated: false,
            files: []
        };

        if(!this.utils.fileManager.existsSync(this.name + '.json')) {
            this.writeGenerationFile(generation);
        }
    }

    finalizeGenerationFile() {
        let generation = this.getGenerationFileContent();
        generation.generated = true;
        this.writeGenerationFile(generation);
    }

    getGenerationFileContent() {
        return JSON.parse(this.utils.fileManager.readFileSync(this.name + '.json', 'utf8'));
    }

    writeGenerationFile(generationContent) {
        let content = JSON.stringify(generationContent);
        return this.utils.writeFile(this.name + '.json', content);
    }

    isFirstGeneration() {
        let generation = this.getGenerationFileContent();
        return !generation.generated;
    }

}

module.exports = Project;