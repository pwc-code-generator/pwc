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
            
            this.initAttributes(parsedField);
            this.setTypeAndSize(parsedField.type);
            this.setValue(parsedField.value);
            this.setItems(parsedField.items);
            this.setValidation(parsedField.validation);
            this.addValidationRules();
            this.setMimeTypes(parsedField.mimeTypes);
            this.setElement(parsedField.element);
            this.setRequired();

        }catch(e){
            console.log(e.stack);
            throw 'Problem with the field object. '.red + parsedField.name + ' ' + e.red;
        }
    }

    initAttributes(parsedField) {
        this.name = parsedField.name;
        this.label = parsedField.label || changeCase.upperCaseFirst(this.name);
        this.value = null;
        this.items = [];
        this.valueString = '';
        this.validationString = '';
        this.searchable = (parsedField.searchable !== undefined) ? parsedField.searchable : false;
        this.default = (parsedField.default !== undefined) ? parsedField.default : null;
        this.hasDefault = (parsedField.default !== undefined) ? true : false;
        this.inList = (parsedField.inList !== undefined) ? parsedField.inList : true;
        this.fileField = false;
        this.isImageField = false;
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

    getValidationAsString() {
        return this.validation;
    }

    getElement() {
        return this.element;
    }

    getDefault() {
        return this.default;
    }

    hasDefault() {
        return this.hasDefault;
    }

    isInList() {
        return this.inList;
    }

    isSearchable() {
        return this.searchable;
    }

    setTypeAndSize(type) {
        let typeParts = type.trim().split(',');
        this.type = typeParts[0];
        this.size = typeParts[1] || null;
        this.setIsFileOrImageField();
    }

    setIsFileOrImageField() {
        this.fileField = (this.type == 'file' || this.type == 'image');
        this.isImageField = (this.type == 'image');
    }

    setItems(items) {
        let itemsForString = [];
        if(items) {
            let itemsValues = items.trim().split(',');
            itemsValues.forEach((item, index) => {
                let itemParts = item.trim().split('|'),
                    itemObject = {
                        index: index,
                        value: itemParts[0],
                        label: itemParts[1] || changeCase.upperCaseFirst(itemParts[0]),
                        getValue: function() { return this.value; },
                        getLabel: function() { return this.label; }
                    };

                itemsForString.push(itemParts[0]);
                this.items.push(itemObject);
            });

            this.itemsString = itemsForString.join(',');
        }
    }

    getItems() {
        return this.items;
    }

    setValue(value) {
        if(value)
            this.value = value;
    }

    getValue() {
        return this.value;
    }

    isFileField() {
        return this.fileField;
    }

    addValidationRules() {
        if(this.isImageField) {
            this.addValitationRule('image');
        }

        if(this.fileField) {
            this.addValitationRule('file');
        }
    }

    addValitationRule(rule) {
        let validation = this.validationString ? this.validationString.trim().split('|') : [];
        validation.push(rule);
        validation = validation.join('|');
        this.setValidation(validation);
    }

    setValidation(validation) {
        if(validation) {
            this.validation = validation.trim().split('|');
            this.validationString = validation;
        } else {
            this.validation = null;
        }
    }

    setMimeTypes(mimeTypes) {
        if(mimeTypes) {
            this.mimeTypes = mimeTypes.trim().split(',');
            this.mimeTypesString = mimeTypes;
            this.addValitationRule('mimetypes:' + this.mimeTypesString);
        } else {
            this.mimeTypes = null;
        }
    }

    hasMimeTypes() {
        return (this.mimeTypes) ? true : false;
    }

    getMimeTypes() {
        return this.mimeTypes;
    }

    getMimeTypesAsString() {
        return this.mimeTypesString;
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
            'datetime': 'date',
            'timestamp': 'date',
            'time': 'text',
            'enum': 'select',
            'file': 'file',
            'image': 'file',
        };

        return elementsByType[this.type];
    }

};

module.exports = Field;