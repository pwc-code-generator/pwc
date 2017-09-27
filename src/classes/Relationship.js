'use strict';

const
    pluralize = require('pluralize');

class Relationship {

    constructor(type, parsedRelationship) {
        try{
            this.type = type;
            this.hasforeignKey = false;
            this.parsedRelationship = parsedRelationship;

            this.setNames();
            this.setForeignKeyName();
            this.setElement();
            this.setValidation();

            this.removeUnwantedAttributes();
        }catch(e){
            console.log(e.stack);
            throw 'Problem with the relationship "' + type + '". '.red + e.red;
        }
    }

    setNames() {
        this.name = this.parsedRelationship.name;
        this.namePlural = pluralize(this.name);
    }

    getName() {
        return this.name;
    }

    getNamePlural() {
        return this.namePlural;
    }

    setForeignKeyName() {
        if(this.type == 'belongsTo') {
            this.hasForeignKey = true;
            this.foreignKeyName = this.name + '_id';
        }
    }

    setElement() {
        this.element = this.parsedRelationship.element || this.getDefaultElement();
    }

    getElement() {
        return this.element;
    }

    setValidation() {
        let validation = this.parsedRelationship.validation || '';
        if(validation) {
            this.validation = validation.trim().split('|');
            this.validationString = validation;
        }else{
            this.validation = null;
            this.validationString = '';
        }
    }

    getValidation() {
        return this.validation;
    }

    getDefaultElement() {
        let elementsByType = {
            'belongsTo': 'select',
            'belongsToMany': 'master-detail',
            'hasOne': 'simple-add',
            'hasMany': 'simple-detail',
        };

        return elementsByType[this.type];
    }

    removeUnwantedAttributes() {
        delete this.parsedRelationship;
    }

    setRelatedModel(model) {
        if(!model)
            throw 'Trying to add a related model in the relationship ' + this.type + ':' + this.name + ' but the model doesn\'t exists';
        this.relatedModel = model;
    }

    getRelatedModel() {
        return this.relatedModel;
    }

}

module.exports = Relationship;