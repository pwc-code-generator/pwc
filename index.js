'use strict';

const
    colors = require('colors'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    commands = require('./src/modules/commands');

module.exports = {
    start: function() {
        try{
            var commandsModule = commands.start();
            var doc = yaml.safeLoad(fs.readFileSync(commandsModule.getFile(), 'utf8'));
            console.log(doc);
        }catch(e){
            var errorMessage = 'ERROR: ' + e;
            console.error(errorMessage.red);
        }
    }
};