'use strict';

const
    pluralize = require('pluralize'),
    changeCase = require('change-case');

class Relationship {

    constructor(type, parsedRelationship) {
        
        try{

            this.initAttributes(type, parsedRelationship);
            this.setNames();
            this.setDisplayField();
            this.setForeignKeyName();
            this.setElement();
            this.setValidation();
            this.setRequired();

            this.removeUnwantedAttributes();
        }catch(e){
            console.log(e.stack);
            throw 'Problem with the relationship "' + type + '". '.red + e.red;
        }
        
    }

    initAttributes(type, parsedRelationship) {
        this.type = type;
        this.hasforeignKey = false;
        this.parsedRelationship = parsedRelationship;
    }

    setNames() {
        this.name = this.parsedRelationship.name;
        this.nameCapitalized = changeCase.upperCaseFirst(this.name);
        this.namePlural = pluralize(this.name);
        this.namePluralCapitalized = changeCase.upperCaseFirst(this.namePlural);
        this.nameSnakeCase = changeCase.snakeCase(this.name);
        this.namePluralSnakeCase = changeCase.snakeCase(this.namePlural);
        this.nameSlugCase = changeCase.paramCase(this.name);
        this.namePluralSlugCase = changeCase.paramCase(this.namePlural);
        this.alias = this.parsedRelationship.alias || this.name;
        this.aliasPlural = (this.parsedRelationship.alias) ? pluralize(this.parsedRelationship.alias) : this.namePlural;
    }

    getName() {
        return this.name;
    }

    getNamePlural() {
        return this.namePlural;
    }

    getNameCapitalized() {
        return this.nameCapitalized || '';
    }

    getNamePluralCapitalized() {
        return this.namePluralCapitalized || '';
    }

    getNameSnakeCase() {
        return this.nameSnakeCase || '';
    }

    getNamePluralSnakeCase() {
        return this.namePluralSnakeCase || '';
    }

    getNameSlugCase() {
        return this.nameSlugCase || '';
    }

    getNamePluralSlugCase() {
        return this.namePluralSlugCase || '';
    }

    getAlias() {
        return this.alias;
    }

    getAliasPlural() {
        return this.aliasPlural;
    }

    getAliasSlugCase() {
        return changeCase.paramCase(this.alias);
    }

    getAliasPluralSlugCase() {
        return changeCase.paramCase(this.aliasPlural);
    }

    setDisplayField() {
        this.displayField = this.parsedRelationship.displayField || 'name';
    }

    getDisplayField() {
        return this.displayField;
    }

    setForeignKeyName() {
        if(this.type == 'belongsTo' || this.type == 'hasOne' || this.type == 'hasMany') {
            this.hasForeignKey = true;
            this.defaultForeignKeyName = this.name + '_id';
            this.foreignKeyName = this.parsedRelationship.foreignKeyName ? this.parsedRelationship.foreignKeyName : this.defaultForeignKeyName;
            this.differentForeignKeyName = (this.defaultForeignKeyName != this.foreignKeyName);
        }
    }

    getForeignKeyName() {
        return this.foreignKeyName;
    }

    hasDifferentForeignKeyName() {
        return this.differentForeignKeyName;
    }

    setElement() {
        this.element = (this.parsedRelationship.element !== undefined) ? this.parsedRelationship.element : this.getDefaultElement();
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

    getValidationAsString() {
        return this.validationString;
    }

    setRequired() {
        this.required = this.isRequired();
    }

    isRequired() {
        let required = false;
        if(this.validation) {
            this.validation.forEach((rule) => {
                if(rule == 'required') required = true;
            });
        }

        return required;
    }

    getDefaultElement() {
        let elementsByType = {
            'belongsTo': 'select',
            'belongsToMany': 'master-datagrid',
            'hasOne': 'simple-add',
            'hasMany': 'simple-datagrid',
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