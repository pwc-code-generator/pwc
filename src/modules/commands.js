'use strict';

const commandLineArgs = require('command-line-args');

const optionsDefinitions = [
    { name: 'generate', alias: 'g', type: String, defaultOption: true },
    { name: 'name', alias: 'n', type: String },
    { name: 'file', alias: 'f', type: String },
    { name: 'plug', alias: 'p', type: String },
];

const optionsValidation = {
    'generate': 'required',
    'name': '',
    'file': 'required',
    'plug': 'required'
};

var commands = {
    init: function() {
        this.options = commandLineArgs(optionsDefinitions);
        this.validateArguments();

        return this;
    },

    validateArguments: function() {
        var validated = true;

        // Validate required arguments
        Object.keys(optionsValidation).map(function(argument){

            let validation = optionsValidation[argument];
            if(validation == 'required' && !this.options[argument]) {
                validated = false;
                console.error('The ' + argument.yellow + ' argument is required!');
            }

        }.bind(this));

        if(!validated) throw 'Specific arguments are required!';
    },

    getGenerator: function() {
        return this.options.generate || '';
    },

    getName: function() {
        return this.options.name || '';
    },

    getFile: function() {
        return this.options.file || '';
    },

    getPlug: function() {
        return this.options.plug || '';
    }
};

module.exports = commands;