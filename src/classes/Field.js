const
    changeCase = require('change-case');

class Field {

    constructor(parsedField) {
        this.name = parsedField.name;
        this.label = parsedField.label || changeCase.upperCaseFirst(this.name);
        this.setTypeAndSize(parsedField.type);
        this.setValidation(parsedField.validation);
        this.setElement(parsedField.element);
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