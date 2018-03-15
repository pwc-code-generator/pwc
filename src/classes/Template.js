'use strict';

const
    TemplateEngine = require('silverb');

class Template {

    constructor(template, name = 'UNKNOWN') {

        console.log('Get template: '.blue.bold + name);
        this.templateEngine = new TemplateEngine(template, name);

    }

    compile(data) {

        return this.templateEngine.compile(data);

    }

}

module.exports = Template;