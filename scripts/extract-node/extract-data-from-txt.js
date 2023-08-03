#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import * as fs from 'fs';
import bounds from './bounds.json' assert { type: 'json' };
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

if (!args.hasOwnProperty('i')) {
    console.error('Input path must be specified with -i');
    process.exit(1);
}
if (!args.hasOwnProperty('o')) {
    console.error('Output path must be specified with -o');
    process.exit(1);
}

let inputPath = args.i
let outputPath = args.o

try {
    fs.readdir(inputPath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        let data = [];

        files.forEach(file => {
            if (file.endsWith('.txt')) {
                let result = parseFile(inputPath + '/' + file);
                data.push(result)
            }
        });

        data = JSON.stringify(data);
        fs.writeFileSync(outputPath + '/data.json', data);
    });

} catch (err) {
    console.error(err);
}

function parseFile(file) {
    let inputText = fs.readFileSync(file, 'utf8');
    inputText = inputText.replace(/(\r\n|\n|\r|\f)/gm, "");

    let result = {}
    bounds.forEach(bound => {
        result[bound.name] = extractText(bound.lowerBound, bound.upperBound, inputText)
    })

    return result;
}

function extractText(lowerBound, upperBound, txt) {
    let pattern = escapeStringRegexp(lowerBound) + '(.*)' + escapeStringRegexp(upperBound)
    let re = new RegExp(pattern, "i");
    let r = txt.match(re);
    if (r)
        return r[1].trim()
}