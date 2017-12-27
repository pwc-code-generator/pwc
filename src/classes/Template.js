'use strict';

class Template {

    constructor(template) {
        this.template = template;
        this.resetTemplate();
    }

    resetTemplate() {
        this.textBlocks = [];
        this.generatedCode = 'var codeBlocks = [];\n';
        this.actualLineIsLogic = false;
        this.previousLineIsLogic = false;
    }

    compile(data) {
        this.resetTemplate();
        this.separateTextFromCodeBlocks();

        this.textBlocks.forEach(block => {
            console.log(this.convertLineCharacters(block.content))
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
        
        let matchJavascriptCodeLineUp = /(^( (lineup)( )*)(if|for|else|switch|case|break|{|}))(.*)?/g;
        let textBlock = {
            content: content,
            isJavascript: isJavascript
        };

        // Detect LineUP (Return the content to the previous lines)
        if(textBlock.content.match(matchJavascriptCodeLineUp)) {
            textBlock.content = textBlock.content.replace('lineup', '');
            textBlock.lineUp = true;
        }

        textBlock.type = this.getBlockContentType(textBlock);

        this.textBlocks.push(textBlock);
    }

    getBlockContentType(block) {
        let matchJavascriptCode = /(^( )*(if|for|else|switch|case|break|{|}))(.*)?/g;

        if(block.isJavascript) {
            return (block.content.match(matchJavascriptCode)) ? 'LOGIC' : 'VARIABLE';
        }

        return 'TEXT';
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
        this.removePreviousBreakLine(blockIndex, true);
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