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
            files: [],
        };

        if(!this.utils.fileManager.existsSync('pwc-gen.json')) {
            this.writeGenerationFile(generation);
        }
    }

    finalizeGenerationFile() {
        let generation = this.getGenerationFileContent();
        generation.generated = true;
        this.writeGenerationFile(generation);
    }

    resetRegisteredFiles() {
        let generation = this.getGenerationFileContent();
        generation.files = [];
        this.writeGenerationFile(generation);
    }

    registerFileGeneration(file) {
        let generation = this.getGenerationFileContent();
        generation.files.push(file);
        this.writeGenerationFile(generation);
    }

    deleteRegisteredFiles() {
        let generation = this.getGenerationFileContent();
        
        generation.files.forEach((file, index) => {
            this.utils.deleteFile(file);
        });

        generation.files = [];

        this.writeGenerationFile(generation);
    }

    getGenerationFileContent() {
        return JSON.parse(this.utils.fileManager.readFileSync('pwc-gen.json', 'utf8'));
    }

    writeGenerationFile(generationContent) {
        let content = JSON.stringify(generationContent, null, 4);
        return this.utils.writeFile('pwc-gen.json', content, 'Registering generation info inside: ');
    }

    isFirstGeneration() {
        let generation = this.getGenerationFileContent();
        return !generation.generated;
    }

}

module.exports = Project;