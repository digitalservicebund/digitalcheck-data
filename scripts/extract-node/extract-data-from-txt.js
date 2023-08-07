#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import * as fs from 'fs';
import bounds from './bounds.json' assert { type: 'json' };
import minimist from 'minimist';
import ObjectsToCsv from "objects-to-csv";

const args = minimist(process.argv.slice(2));

if (!args.hasOwnProperty('i')) {
    console.error('Input path must be specified with -i');
    process.exit(1);
}
if (!args.hasOwnProperty('o')) {
    console.error('Output file must be specified with -o');
    process.exit(1);
}

let inputPath = args.i
let outputFile = args.o
let outputFormat = 'json'

if (args.hasOwnProperty('f')) {
    outputFormat = args.f
    if (outputFormat !== 'json' && outputFormat !== 'csv') {
        console.error('Output format must be json or csv');
        process.exit(1);
    }
}


try {
    fs.readdir(inputPath, async (err, files) => {
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

        if (outputFormat === 'json') {
            saveToJsonFile(data, outputFile);
        } else if (outputFormat === 'csv') {
            saveToCsvFile(data, outputFile)
        }
    });

} catch (err) {
    console.error(err);
}

function parseFile(file) {
    let inputText = fs.readFileSync(file, 'utf8');
    inputText = inputText.replace(/(\r\n|\n|\r|\f)/gm, "");

    let textData = {}
    bounds.forEach(bound => {
        textData[bound.name] = extractText(bound.lowerBound, bound.upperBound, inputText)
    })

    let respectiveDataFile = file.replace('.txt', '_data.json')
    let checkboxAndRadioData = JSON.parse(fs.readFileSync(respectiveDataFile));

    return {
        dcVersion: '1.2',
        ...textData,
        ...checkboxAndRadioData
    };
}

function extractText(lowerBound, upperBound, txt) {
    let pattern = escapeStringRegexp(lowerBound) + '(.*)' + escapeStringRegexp(upperBound)
    let re = new RegExp(pattern, "i");
    let r = txt.match(re);
    if (r)
        return r[1].trim()
}

function saveToJsonFile(data, outputFile) {
    data = JSON.stringify(data);
    fs.writeFileSync(outputFile, data);
}

async function saveToCsvFile(data, outputFile) {
    const csv = new ObjectsToCsv(data);
    await csv.toDisk(outputFile);
}
