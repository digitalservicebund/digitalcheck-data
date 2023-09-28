#!/usr/bin/env node

import * as fs from 'fs';
import order from './order.json' assert {type: 'json'};
import minimist from 'minimist';
import ObjectsToCsv from 'objects-to-csv';
import csv from 'csv-parser'

const args = minimist(process.argv.slice(2));

if (!args.hasOwnProperty('p')) {
    console.error('Parsed data input file must be specified with -p');
    process.exit(1);
}
if (!args.hasOwnProperty('n')) {
    console.error('NKR data input file  must be specified with -n');
    process.exit(1);
}
if (!args.hasOwnProperty('o')) {
    console.error('Output path must be specified with -o');
    process.exit(1);
}

let parsedDataInputFile = args.p
let nkrDataInputFile = args.n
let outputPath = args.o

try {
    let nkrDataArray = []
    let nkrData = new Map();
    fs.createReadStream(nkrDataInputFile)
        .pipe(csv())
        .on('data', (data) => {
            nkrDataArray.push(data);
        })
        .on('end', async () => {
            nkrDataArray.forEach(row => {
                nkrData.set(row["NKRNr"], row);
            });

            let parsedData = readParsedDataJSON();
            let mergedData = merge(parsedData, nkrData);

            saveToJsonFile(mergedData, outputPath + 'data.json');
            await saveToCsvFile(mergedData, outputPath + 'data.csv')
        });

} catch (err) {
    console.error(err);
}


function readParsedDataJSON() {
    return JSON.parse(fs.readFileSync(parsedDataInputFile, 'utf8'));
}

function merge(parsedData, nkrData) {
    let mergedData = nkrData

    parsedData.forEach(element => {
        if (element.hasOwnProperty("NKRNr")) {
            let merged = {
                ...mergedData.get(element["NKRNr"]),
                ...convertAllBooleanToString(element)
            }
            mergedData.set(element["NKRNr"], merged)
        }
    })

    let mergedDataArray = [...mergedData.values()];
    return mergedDataArray.map(element => sortObjectAttributes(element, order))
}


function saveToJsonFile(data, outputFile) {
    data = JSON.stringify(data);
    fs.writeFileSync(outputFile, data);
}

async function saveToCsvFile(data, outputFile) {
    const csv = new ObjectsToCsv(data);
    await csv.toDisk(outputFile, {});
}

function sortObjectAttributes(obj, keyOrder) {
    const sortedObj = {};

    keyOrder.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            sortedObj[key] = obj[key];
        } else {
            sortedObj[key] = ""
        }
    });

    return sortedObj;
}

function convertAllBooleanToString(element) {
    for (const [key, value] of Object.entries(element)) {
        if (typeof value === 'boolean') {
            element[key] = value ? 'TRUE' : 'FALSE';
        }
    }
    return element
}