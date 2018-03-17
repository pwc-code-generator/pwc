const
    // Classes
    Field = require('./Field'),
    Relationship = require('./Relationship'),

    // Modules
    pluralize = require('pluralize'),
    changeCase = require('change-case');

class Model {

    constructor(parsedModel) {

        try{

            this.initAttributes(parsedModel);
            this.buildNames();
            this.buildDescription();
            this.setupFields();
            this.setupRelationships();
            this.removeUnwantedAttributes();

        }catch(e){
            console.log(e.stack);
            throw 'Problem with the model "' + parsedModel.name.yellow + '". '.red + e.red;
        }

    }

    initAttributes(parsedModel) {
        this.parsedModel = parsedModel;

        this.index = this.parsedModel.index;
        this.onlyModel = this.parsedModel.onlyModel || false;
        this.relationship = this.parsedModel.isRelationship || false;
        this.fields = [];
        this.fieldsCount = 0;
        this.relationships = [];
        this.belongsToRelationships = [];
        this.belongsToManyRelationships = [];
        this.hasOneRelationships = [];
        this.hasManyRelationships = [];
    }

    getIndex() {
        return this.index;
    }

    isOnlyModel() {
        return this.onlyModel;
    }

    isRelationship() {
        return this.relationship;
    }

    buildNames() {
        this.name = this.parsedModel.name;
        this.nameCapitalized = changeCase.upperCaseFirst(this.name);
        this.namePlural = this.parsedModel.namePlural || pluralize(this.name);
        this.namePluralCapitalized = changeCase.upperCaseFirst(this.namePlural);
        this.nameSnakeCase = changeCase.snakeCase(this.name);
        this.namePluralSnakeCase = changeCase.snakeCase(this.namePlural);
        this.nameSlugCase = changeCase.paramCase(this.name);
        this.namePluralSlugCase = changeCase.paramCase(this.namePlural);
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

    getNameSlugCase() {
        return this.nameSlugCase || '';
    }

    getNamePluralSlugCase() {
        return this.namePluralSlugCase || '';
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
        this.fieldsCount = 0;

        if(fields) {
            Object.keys(fields).map((fieldName) => {
                let parsedField = fields[fieldName];
                    parsedField.name = fieldName;

                let field = new Field(parsedField);
                this.fields.push(field);
            });

            this.fieldsCount = this.fields.length;
        }
    }

    getFields() {
        return this.fields;
    }

    setupRelationships() {
        this.buildBelongsToRelationship(this.parsedModel.belongsTo);
        this.buildBelongsToManyRelationship(this.parsedModel.belongsToMany);
        this.buildHasOneRelationship(this.parsedModel.hasOne);
        this.buildHasManyRelationship(this.parsedModel.hasMany);
    }

    buildRelationship(type, relationship, callback) {
        if(relationship) {
            Object.keys(relationship).map((relationshipName) => {
                let parsedRelationship = relationship[relationshipName];
                    parsedRelationship.name = relationshipName;

                let newRelationship = new Relationship(type, parsedRelationship);
                this.relationships.push(newRelationship);
                if(callback) callback(newRelationship);
            });
        }
    }

    buildBelongsToRelationship(relationship) {
        this.buildRelationship('belongsTo', this.parsedModel.belongsTo, (relationship) => {
            this.belongsToRelationships.push(relationship);
        });
    }

    buildBelongsToManyRelationship(relationship) {
        this.buildRelationship('belongsToMany', this.parsedModel.belongsToMany, (relationship) => {
            this.belongsToManyRelationships.push(relationship);
        });
    }

    buildHasOneRelationship(relationship) {
        this.buildRelationship('hasOne', this.parsedModel.hasOne, (relationship) => {
            this.hasOneRelationships.push(relationship);
        });
    }

    buildHasManyRelationship(relationship) {
        this.buildRelationship('hasMany', this.parsedModel.hasMany, (relationship) => {
            this.hasManyRelationships.push(relationship);
        });
    }

    belongsTo(model) {
        let belongs = false;

        this.belongsToRelationships.forEach((relationship) => {
            if(relationship.relatedModel == model) {
                belongs = true;
            }
        });

        return belongs;
    }

    removeUnwantedAttributes() {
        delete this.parsedModel;
    }

}

module.exports = Model;