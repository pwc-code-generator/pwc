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
            this.value = [];
            this.valueString = '';
            this.default = parsedField.default || null;

            this.setTypeAndSize(parsedField.type);
            this.setValue(parsedField.value);
            this.setValidation(parsedField.validation);
            this.setElement(parsedField.element);
            this.setRequired();
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

    setValue(value) {
        let valuesForString = [];
        if(value) {
            let values = value.trim().split(',');
            values.forEach((value, index) => {
                let valueParts = value.trim().split('|'),
                    valueObject = {
                        ìndex: index,
                        value: valueParts[0],
                        label: valueParts[1] || changeCase.upperCaseFirst(valueParts[0])
                    };

                valuesForString.push(valueParts[0]);
                this.value.push(valueObject);
            });

            this.valueString = valuesForString.join(',');
        }
    }

    getValue() {
        return this.value;
    }

    setValidation(validation) {
        if(validation) {
            this.validation = validation.trim().split('|');
            this.validationString = validation;
        } else {
            this.validation = null;
        }
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