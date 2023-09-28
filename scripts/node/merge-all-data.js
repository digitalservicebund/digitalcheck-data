#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import * as fs from 'fs';
import textFields from './textFields.json' assert {type: 'json'};
import order from './order.json' assert {type: 'json'};
import minimist from 'minimist';
import ObjectsToCsv from 'objects-to-csv';

const TITLE_BOUND_NAME = 'Titel_DC'; // must be the same as in textFields.json
const TITLE_2_BOUND_NAME = 'Titel2_DC'; // must be the same as in textFields.json

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
let expectedNumberOfRows = null;


try {
    parseFiles();
} catch (err) {
    console.error(err);
}

function parseFiles() {
    fs.readdir(inputPath, async (err, files) => {
        if (err) {
            console.error('Unable to scan directory: ' + err);
            process.exit(1);
        }

        let data = [];

        files.forEach(filename => {
            if (filename.endsWith('.txt')) {
                let result = parseFile(inputPath, filename);
                data.push(result)
            }
        });

        saveToJsonFile(data, outputPath + 'parsed-data.json');
        await saveToCsvFile(data, outputPath + 'parsed-data.csv')

        if (expectedNumberOfRows !== null && expectedNumberOfRows !== data.length) {
            console.error(`\nERROR!\nERROR: Unexpected number of rows. Expected ${expectedNumberOfRows} but got ${data.length}.\nERROR!`)
            process.exit(1);
        }
    });
}

function parseFile(inputPath, filename) {
    let file = inputPath + '/' + filename

    let inputText = fs.readFileSync(file, 'utf8');
    inputText = inputText.replace(/(\r\n|\n|\r|\f)/gm, "");

    let textData = {}
    textFields.forEach(field => {
        textData[field.name] = extractTextBetween(field.lowerBound, field.upperBound, inputText)
    })

    if (textData[TITLE_BOUND_NAME] === "") {
        textData[TITLE_BOUND_NAME] = textData[TITLE_2_BOUND_NAME]
    }

    let respectiveDataFile = file.replace('.txt', '_data.json')
    let checkboxAndRadioData = JSON.parse(fs.readFileSync(respectiveDataFile));

    return sortObjectAttributes({
        'Version_DC': '1.2',
        'NKRNr': getFirstMatch('_([0-9]+)_', filename),
        'Dateiname_DC': getOriginalPDFFilename(filename),
        ...textData,
        ...checkboxAndRadioData
    }, order);
}

function extractTextBetween(lowerBound, upperBound, txt) {
    return getFirstMatch(matchShortestStringBetween(lowerBound, upperBound), txt);
}

function getFirstMatch(pattern, txt) {
    let re = new RegExp(pattern, "i");
    let r = txt.match(re);
    if (r)
        return r[1].trim()
    return ""
}

function matchShortestStringBetween(lowerBound, upperBound) {
    return escapeStringRegexp(lowerBound) + '((?:(?!' + lowerBound + ').)*?)' + escapeStringRegexp(upperBound);
}

function getOriginalPDFFilename(filename) {
    return filename.replace('.txt', '.pdf');
}

function saveToJsonFile(data, outputFile) {
    data = JSON.stringify(data);
    fs.writeFileSync(outputFile, data);
}

async function saveToCsvFile(data, outputFile) {
    const csv = new ObjectsToCsv(data);
    await csv.toDisk(outputFile);
}

function sortObjectAttributes(obj, keyOrder) {
    const sortedObj = {};

    keyOrder.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            sortedObj[key] = obj[key];
        }
    });

    return sortedObj;
}