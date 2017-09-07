const
    // Modules
    pluralize = require('pluralize'),
    changeCase = require('change-case');

class Model {

    constructor(parsedModel, pluralizeModule, changeCaseModule) {
        this.parsedModel = parsedModel;
        this.pluralize = pluralizeModule;
        this.changeCase = changeCaseModule;

        this.onlyModel = this.parsedModel.onlyModel || false;
    }

    removeUnwantedAttributes() {
        delete this.parsedModel;
        delete this.pluralize;
        delete this.changeCase;
    }

    buildNames() {
        this.name = this.parsedModel.name;
        this.namePlural = pluralize(this.name);
        this.nameSnakeCase = changeCase.snakeCase(this.name);
        this.namePluralSnakeCase = changeCase.snakeCase(this.namePlural);
    }

    getName() {
        return this.name || '';
    }

    getNamePlural() {
        return this.name || '';
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

}

module.exports = Model;