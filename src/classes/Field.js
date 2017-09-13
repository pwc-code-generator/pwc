const
    changeCase = require('change-case');

/**
*
* Field Class
*
* A Field is a object containing the attributes below:
* - Name - The name of field, used in database and programming cases
* - Label - The label description of the field, used to generate views
* - Type - The field type, used to set the correct database type
* - Validation - An array with validation rules
* - Element - The visible element that will represent the field Eg: HTML Element
*
*/

class Field {

    constructor(parsedField) {
        try{
            this.name = parsedField.name;
            this.label = parsedField.label || changeCase.upperCaseFirst(this.name);
            this.setTypeAndSize(parsedField.type);
            this.setValidation(parsedField.validation);
            this.setElement(parsedField.element);
        }catch(e){
            console.log(e.stack);
            throw 'Problem with the field object. '.red + e.red;
        }
    }

    getName() {
        return this.name;
    }

    getLabel() {
        return this.label;
    }

    getType() {
        return this.type;
    }

    getSize() {
        return this.size;
    }

    getValidation() {
        return this.validation;
    }

    getElement() {
        return this.element;
    }

    setTypeAndSize(type) {
        let typeParts = type.trim().split(',');
        this.type = typeParts[0];
        this.size = typeParts[1] || null;
    }

    setValidation(validation) {
        if(validation) {
            this.validation = validation.trim().split('|');
            this.validationString = validation;
        } else {
            this.validation = null;
        }
    }

    isRequired() {
        if(this.validation) {
            this.validation.forEach((rule) => {
                if(rule == 'required') return true;
            });
        }

        return false;
    }

    setElement(element) {
        this.element = element || this.getDefaultElement();
    }

    getDefaultElement() {
        let elementsByType = {
            'string': 'text',
            'text': 'textarea',
            'integer': 'number',
            'decimal': 'number',
            'boolean': 'checkbox',
            'date': 'date',
            'enum': 'select',
            'file': 'file',
            'image': 'file',
        };

        return elementsByType[this.type];
    }

};

module.exports = Field;