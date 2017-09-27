'use strict';

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

}

module.exports = Project;