const
    // Classes
    Field = require('./Field'),
    Relationship = require('./Relationship'),

    // Modules
    pluralize = require('pluralize'),
    changeCase = require('change-case');

class Model {

    constructor(parsedModel, pluralizeModule, changeCaseModule) {
        try{
            this.parsedModel = parsedModel;

            this.onlyModel = this.parsedModel.onlyModel || false;
            this.fields = [];
            this.relationships = [];
            
            this.buildNames();
            this.buildDescription();
            this.setupFields();
            this.setupRelationships();
            this.removeUnwantedAttributes();
        }catch(e){
            console.log(e.stack);
            throw 'Model Error: '.red + e.red;
        }
    }

    removeUnwantedAttributes() {
        delete this.parsedModel;
    }

    buildNames() {
        this.name = this.parsedModel.name;
        this.nameCapitalized = changeCase.upperCaseFirst(this.name);
        this.namePlural = pluralize(this.name);
        this.namePluralCapitalized = changeCase.upperCaseFirst(this.namePlural);
        this.nameSnakeCase = changeCase.snakeCase(this.name);
        this.namePluralSnakeCase = changeCase.snakeCase(this.namePlural);
    }

    getName() {
        return this.name || '';
    }

    getNamePlural() {
        return this.namePlural || '';
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

    buildDescription() {
        let description = this.parsedModel.description || '';
        
        this.descriptionArticle = 'the';
        this.descriptionArticlePlural = 'the';

        if(!description) {
            this.description = changeCase.sentenceCase(this.getName());
            this.descriptionPlural = changeCase.sentenceCase(this.getNamePlural());
        }else{
            this.buildCustomDescription(description);
        }
    }

    buildCustomDescription(description) {
        let descriptionParts = description.split(',');
        descriptionParts = descriptionParts.map(function(part) { return part.trim() });
        this.setCustomDescriptionSingularAndPlural(descriptionParts[0]);
        if(descriptionParts[1])
            this.setCustomDescriptionArticleSingularAndPlural(descriptionParts[1]);
    }

    setCustomDescriptionSingularAndPlural(descriptionParts) {
        let description = descriptionParts.split('|');

        if(description.length < 2) 
            throw 'Please inform a valid custom description in the format Singular|Plural. Eg: Product|Products';

        this.description = description[0];
        this.descriptionPlural = description[1];
    }

    setCustomDescriptionArticleSingularAndPlural(descriptionParts) {
        let descriptionArticle = descriptionParts.split('|');

        if(descriptionArticle.length < 2) 
            throw 'Please inform a valid custom article in the format Singular|Plural. Eg: the|the (English), o|os (Portuguese)';

        this.descriptionArticle = descriptionArticle[0];
        this.descriptionArticlePlural = descriptionArticle[1];
    }

    getDescription() {
        return this.description;
    }

    getDescriptionPlural() {
        return this.descriptionPlural;
    }

    getDescriptionArticle() {
        return this.descriptionArticle;
    }

    getDescriptionArticlePlural() {
        return this.descriptionArticlePlural;
    }

    setupFields() {
        let fields = this.parsedModel.fields;
        Object.keys(fields).map((fieldName) => {
            let parsedField = fields[fieldName];
                parsedField.name = fieldName;

            let field = new Field(parsedField);
            this.fields.push(field);
        });
    }

    setupRelationships() {
        this.buildRelationship('belongsTo', this.parsedModel.belongsTo);
        this.buildRelationship('belongsToMany', this.parsedModel.belongsToMany);
        this.buildRelationship('hasOne', this.parsedModel.hasOne);
        this.buildRelationship('hasMany', this.parsedModel.hasMany);
    }

    buildRelationship(type, relationship) {
        if(relationship) {
            Object.keys(relationship).map((relationshipName) => {
                let parsedRelationship = relationship[relationshipName];
                    parsedRelationship.name = relationshipName;

                let newRelationship = new Relationship(type, parsedRelationship);
                this.relationships.push(newRelationship);
            });
        }
    }

}

module.exports = Model;