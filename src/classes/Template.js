'use strict';

class Template {

    constructor(template) {
        this.template = template;
        this.resetTemplate();
    }

    blockTypes() {
        return [
            {
                start: '<%',
                end: '%>',
                keepIdentation: true,
                endNewLine: false
            },

            {
                start: '<&',
                end: '&>',
                keepIdentation: false,
                endNewLine: true
            }
        ];
    }

    resetTemplate() {
        this.textBlocks = [];
        this.generatedCode = 'var codeBlocks = [];\n';
        this.actualLineIsLogic = false;
        this.previousLineIsLogic = false;
    }

    compile(data) {
        this.separateTextFromCodeBlocks();

        this.textBlocks.forEach(block => {
            this.addLine(block);
        });
        
        this.finishGeneratedCode();
        //console.log(this.generatedCode);

        return new Function(this.generatedCode.replace(/[\r\t\n]/g, '')).apply(data);
    }

    separateTextFromCodeBlocks() {
        let matchBlocks = new RegExp("<%(.+?)%>", "g"),
            cursor = 0,
            match;

        while(match = matchBlocks.exec(this.template)) {
            this.addTextBlock(this.template.slice(cursor, match.index));
            this.addTextBlock(match[1], true);

            cursor = match.index + match[0].length;
        }

        this.addTextBlock(this.template.substr(cursor, this.template.length - cursor));
        this.removeUnwantedLines();
        //console.log(this.textBlocks);
    }

    addTextBlock(content, isJavascript = false) {
        let textBlock = {
            content: content,
            isJavascript: isJavascript
        };

        textBlock.type = this.getBlockContentType(textBlock);
        this.textBlocks.push(textBlock);
    }

    getBlockContentType(block) {
        let matchJavascriptCode = /(^( )*(if|for|else|switch|case|break|{|}))(.*)?/g;

        if(block.isJavascript) {
            return block.content.match(matchJavascriptCode) ? 'LOGIC' : 'VARIABLE';
        }

        return 'TEXT';
    }

    /**
     * This method will remove the unwanted lines from the template
     * These lines are resulting from the logic lines inside the template
     */
    removeUnwantedLines() {
        this.textBlocks.forEach((block, index) => {
            if(block.type === 'LOGIC') {
                this.removePreviousBreakLine(index);
            }
        });
    }

    removePreviousBreakLine(blockIndex) {
        let previousBlock = this.textBlocks[blockIndex - 1];
        previousBlock.content = previousBlock.content.replace(/(\r\n|\n|\r){1}(?=[^(\r\n|\n|\r)]*$)/, '');
    }

    addLine(block) {
        if(block.isJavascript) {
            this.generatedCode += (block.type === 'LOGIC') ? block.content + '\n' : 'codeBlocks.push(' + block.content + ');\n';
        } else {
            this.generatedCode += 'codeBlocks.push("' + this.convertLineCharacters(block.content) + '");\n';
        }
    }

    convertLineCharacters(line) {
        line = line.replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\t/g, '\\t')
                .replace(/\r/g, '\\r');

        return line;
    }

    finishGeneratedCode() {
        this.generatedCode += 'return codeBlocks.join("");';
    }

}

module.exports = Template;