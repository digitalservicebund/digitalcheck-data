#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import * as fs from 'fs';
import textFields_1_2_1 from './textFields_v1.2.1.json' assert {type: 'json'};
import textFields_1_2_2 from './textFields_v1.2.2.json' assert {type: 'json'};
import order from './order.json' assert {type: 'json'};
import minimist from 'minimist';
import ObjectsToCsv from 'objects-to-csv';

const TITLE_BOUND_NAME = 'Titel_DC'; // must be the same as in textFields_v1.2.2.json
const TITLE_2_BOUND_NAME = 'Titel2_DC'; // must be the same as in textFields_v1.2.2.json

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
if (args.hasOwnProperty('n')) {
    expectedNumberOfRows = args.n
}

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

    let textFields = getTextFieldsByVersion(inputText);

    let data = {}
    textFields.forEach(field => {
        data[field.name] = extractTextBetween(field.lowerBound, field.upperBound, inputText)
    })

    if (data[TITLE_BOUND_NAME] === "") {
        data[TITLE_BOUND_NAME] = data[TITLE_2_BOUND_NAME]
    }

    analyzeData(data);

    let respectiveDataFile = file.replace('.txt', '_data.json')
    let checkboxAndRadioData = JSON.parse(fs.readFileSync(respectiveDataFile));

    return sortObjectAttributes({
        'Version_DC': '1.2',
        'NKRNr': getFirstMatch('([0-9][0-9][0-9][0-9])_', filename),
        'Dateiname_DC': getOriginalPDFFilename(filename),
        ...data,
        ...checkboxAndRadioData
    }, order);
}

function getTextFieldsByVersion(inputText) {
    return inputText.indexOf("Begründung (optional):") === -1 ? textFields_1_2_2 : textFields_1_2_1;
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

function analyzeData(data) {
    for (const [key, value] of Object.entries(data)) {
        data[key + "_wc"] = countWords(value);
        data[key + "_§"] = countOccurrences(value, "§")
    }
}

function countOccurrences(string, substring) {
    const regex = new RegExp(substring, 'g');
    const matches = string.match(regex);
    return matches ? matches.length : 0;
}

function countWords(inputString) {
    const words = inputString.split(/\s+/);
    const filteredWords = words.filter(word => word.length > 0);
    return filteredWords.length;
}

function getOriginalPDFFilename(filename) {
    return filename.replace('.txt', '.pdf');
}

function saveToJsonFile(data, outputFile) {
    data = JSON.stringify(data);
    fs.writeFileSync(outputFile, data);
}

async function saveToCsvFile(data, outputFile) {
    convertAllBooleanToString(data)

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

function convertAllBooleanToString(data) {
    data.forEach(element => {
        for (const [key, value] of Object.entries(element)) {
            if (typeof value === 'boolean') {
                element[key] = value ? 'TRUE' : 'FALSE';
            }
        }
    })
}