'use strict';

const
    // Classes
    Util = require('./src/classes/Util'),

    // Modules
    colors = require('colors'),
    commands = require('./src/modules/commands'),
    project = require('./src/modules/project');

module.exports = {
    init: function() {
        try{
            commands.init();
            
            const 
                util = new Util,
                Plug = require(commands.getPlug()),
                plugStarter = new Plug(util);

            if(commands.getGenerator() == 'project') {

                let parsedProject = project.init(commands);
                plugStarter.initProject(parsedProject);

            } else if(commands.getGenerator() == 'model') {
                console.log('Model Generator is not supported at this moment'.yellow);
            } else
                throw 'Please, specify a valid generator in the --generate,-g argument (project|module)';

        }catch(e){
            let errorMessage = 'ERROR: ' + e;
            console.error(errorMessage.red);
        }
    }
};