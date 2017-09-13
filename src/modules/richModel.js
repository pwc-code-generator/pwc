'use strict';

const
    Model = require('../classes/Model');

var richModel = {
    init: function(modelName, parsedModel) {
        try{
            
            parsedModel.name = modelName;
        
            let model = new Model(parsedModel);
            return model;

        }catch(e){
            console.log(e.stack);
            throw 'Problem with the model "' + modelName.yellow + '". '.red + e.red;
        }
    }
}

module.exports = richModel;