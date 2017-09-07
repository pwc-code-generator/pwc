'use strict';

const
    colors = require('colors'),
    commands = require('./src/modules/commands'),
    project = require('./src/modules/project');

module.exports = {
    init: function() {
        try{
            commands.init();

            if(commands.getGenerator() == 'project')
                project.init(commands);
            else if(commands.getGenerator() == 'module')
                console.log('Module Generator is not supported at this moment'.yellow);
            else
                throw 'Please, specify a valid generator in the --generate,-g argument (project|module)';

        }catch(e){
            let errorMessage = 'ERROR: ' + e;
            console.error(errorMessage.red);
        }
    }
};