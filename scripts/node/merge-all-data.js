#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import * as fs from 'fs';
import bounds from './bounds.json' assert { type: 'json' };
import order from './order.json' assert { type: 'json' };
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
let outputFormat = 'json' // default
let expectedNumberOfRows = null;

if (args.hasOwnProperty('f')) {
    outputFormat = args.f
    if (outputFormat !== 'json' && outputFormat !== 'csv') {
        console.error('Output format must be json or csv');
        process.exit(1);
    }
}
if (args.hasOwnProperty('n')) {
    expectedNumberOfRows = args.n
}

try {
    fs.readdir(inputPath, async (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        let data = [];

        files.forEach(file => {
            if (file.endsWith('.txt')) {
                let result = parseFile(inputPath, file);
                data.push(result)
            }
        });

        if (outputFormat === 'json') {
            saveToJsonFile(data, outputFile);
        } else if (outputFormat === 'csv') {
            await saveToCsvFile(data, outputFile)
        }

        if (expectedNumberOfRows !== null && expectedNumberOfRows !== data.length) {
            console.error(`\nERROR!\nERROR: Unexpected number of rows. Expected ${expectedNumberOfRows} but got ${data.length}.\nERROR!`)
            process.exit(1);
        }
    });

} catch (err) {
    console.error(err);
}

function parseFile(inputPath, filename) {
    let file = inputPath + '/' + filename
    let inputText = fs.readFileSync(file, 'utf8');
    inputText = inputText.replace(/(\r\n|\n|\r|\f)/gm, "");

    let textData = {}
    bounds.forEach(bound => {
        textData[bound.name] = extractText(bound.lowerBound, bound.upperBound, inputText)
    })

    let respectiveDataFile = file.replace('.txt', '_data.json')
    let checkboxAndRadioData = JSON.parse(fs.readFileSync(respectiveDataFile));

    return sortObjectAttributes({
        dcVersion: '1.2',
        dcFileName: getOriginalPDFFilename(filename),
        ...textData,
        ...checkboxAndRadioData
    }, order);
}

function extractText(lowerBound, upperBound, txt) {
    let pattern = escapeStringRegexp(lowerBound) + '(.*)' + escapeStringRegexp(upperBound)
    let re = new RegExp(pattern, "i");
    let r = txt.match(re);
    if (r)
        return r[1].trim()
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