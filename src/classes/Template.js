'use strict';

class Template {

    constructor(template) {
        this.template = template;
        this.initSettings();
        this.resetTemplate();
    }

    initSettings() {
        this.settings = {
            blocksMatch: '',
            blocks: {
                logic: {
                    index: 1,
                    match: '<%(.+?)%>',
                    type: 'LOGIC'
                },
                variable: {
                    index: 2,
                    match: '<\\$(.+?)\\$>',
                    type: 'VARIABLE'
                },
                logicLineUp: {
                    index: 3,
                    match: '<up(.+?)up>',
                    type: 'LOGIC'
                },
            }
        };

        this.setAllBlocksMatching();
    }

    /**
     * Set all the blocks regular expressions to future search on the template
     */
    setAllBlocksMatching() {
        let matches = [];

        for (const [index,block] of Object.entries(this.settings.blocks)) {
            matches.push(block.match);
        }

        this.settings.blocksMatch = matches.join('|');
    }

    resetTemplate() {
        this.textBlocks = [];
        this.generatedCode = 'var codeBlocks = [];\n';
        this.actualLineIsLogic = false;
        this.previousLineIsLogic = false;
    }

    compile(data) {
        this.resetTemplate();
        this.treatTemplateCode();
        this.separateTextFromCodeBlocks();

        this.textBlocks.forEach(block => {
            this.addLine(block);
        });
        
        this.finishGeneratedCode();
        console.log(this.generatedCode)

        return new Function(this.generatedCode.replace(/[\r\t\n]/g, '')).apply(data);
    }

    treatTemplateCode() {
        // Removes breaklines from logic blocks
        this.template = this.template.replace(/(\r\n|\n|\r||\u2028|\u2029){1}([^(\r\n|\n|\r||\u2028|\u2029)])(\t| )*(<%)/g, '<%');
        //this.template = this.template.replace(/(\r\n|\n|\r||\u2028|\u2029){1}([^(\r\n|\n|\r||\u2028|\u2029)])(\t| )*(<up)/g, '<up');

        // Removes spaces and breaklines after lineup logic block
    }

    separateTextFromCodeBlocks() {
        let matchBlocks = new RegExp(this.settings.blocksMatch, "g"),
            cursor = 0,
            match;

        while(match = matchBlocks.exec(this.template)) {

            this.addTextBlock(this.template.slice(cursor, match.index));
            this.addAllJavaScriptBlocks(match);

            cursor = match.index + match[0].length;
            
        }

        this.addTextBlock(this.template.substr(cursor, this.template.length - cursor));
        //this.removeUnwantedLines();
    }

    addAllJavaScriptBlocks(templateMatch) {
        for (const [index,block] of Object.entries(this.settings.blocks)) {
            if(templateMatch[block.index]) {
                this.addTextBlock(templateMatch[block.index], true, block.type);
            }
        }
    }

    addTextBlock(content, isJavascript = false, type = 'TEXT') {
        let matchJavascriptCodeLineUp = /(^( (lineup)( )*)(var|let|console|if|for|else|switch|case|break|{|}))(.*)?/g;
        let textBlock = {
            content: content,
            isJavascript: isJavascript,
            type: type
        };

        // Detect LineUP (Return the content to the previous lines)
        if(textBlock.content.match(matchJavascriptCodeLineUp)) {
            textBlock.content = textBlock.content.replace('lineup', '');
            textBlock.lineUp = true;
        }

        this.textBlocks.push(textBlock);
    }

    /**
     * This method will remove the unwanted lines from the template
     * These lines are resulting from the logic lines inside the template
     */
    removeUnwantedLines() {
        this.textBlocks.forEach((block, blockIndex) => {
            if(block.type === 'LOGIC') {
                block.lineUp ? this.removeAllPreviousSpaces(blockIndex) : this.removePreviousBreakLine(blockIndex);
            }
        });
    }

    removePreviousBreakLine(blockIndex, removeSpacesToo = false) {
        let previousBlock = this.textBlocks[blockIndex - 1],
            lastBreakLine,
            lastBreakLineResult,
            lastBreakLineIndex,
            lastBreakLineMatch = /(\r\n|\n|\r){1}(?=([^(\r\n|\n|\r)])*$)/, // Last Break Line
            onlyWhiteSpacesMatch = /^(\r\n|\n|\r)(\s|\t)*$/g; // Break Line only with white spaces after

        lastBreakLineResult = lastBreakLineMatch.exec(previousBlock.content);
        lastBreakLineIndex = (lastBreakLineResult) ? lastBreakLineResult.index : null;
        lastBreakLine = (lastBreakLineIndex) ? previousBlock.content.substring(lastBreakLineIndex) : null;

        if(onlyWhiteSpacesMatch.test(lastBreakLine)) {
            let textToRemove = (removeSpacesToo) ? lastBreakLine : lastBreakLineMatch;
            previousBlock.content = previousBlock.content.replace(textToRemove, '');
        }
    }

    removeAllPreviousSpaces(blockIndex) {
        //this.removePreviousBreakLine(blockIndex, true);
        let block = this.textBlocks[blockIndex + 1];
        block.content = block.content.replace(/(\r\n|\n|\r)*/g, ''); // Remove break lines
        block.content = block.content.replace(/(\s|\t)*/g, ''); // Remove white spaces
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