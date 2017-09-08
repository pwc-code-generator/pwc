'use strict';

const
    Model = require('../classes/Model');

var richModel = {
    init: function(modelName, parsedModel) {
        try{
            parsedModel.name = modelName;
        
            this.model = new Model(parsedModel);
            this.model.buildNames();
            this.model.buildDescription();
            this.model.setupFields();

            this.model.removeUnwantedAttributes();

            return this.model;
        }catch(e){
            throw 'Problem with the model "' + modelName.yellow + '". '.red + e.red;
        }
    }
}

module.exports = richModel;