#!/usr/bin/env node

import * as fs from "fs";
import minimist from "minimist";
import ObjectsToCsv from "objects-to-csv";
import csv from "csv-parser";

const args = minimist(process.argv.slice(2));

if (!args.hasOwnProperty("p")) {
  console.error("Parsed data input file must be specified with -p");
  process.exit(1);
}
if (!args.hasOwnProperty("n")) {
  console.error("NKR data input file  must be specified with -n");
  process.exit(1);
}
if (!args.hasOwnProperty("o")) {
  console.error("Output path must be specified with -o");
  process.exit(1);
}

let parsedDataInputFile = args.p;
let nkrDataInputFile = args.n;
let outputPath = args.o;

const readCSV = (file) =>
  new Promise((resolve) => {
    const fileArray = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => {
        fileArray.push(data);
      })
      .on("end", async () => {
        resolve(fileArray);
      });
  });

const merge = (nkrDataArray, toBeMergedDataArray) =>
  nkrDataArray.map((nkrRow) => {
    const matchedRow = toBeMergedDataArray.find(
      (row) => row.NKRNr === nkrRow.NKRNr
    );
    const EDDarstellung = matchedRow?.EDDarstellung;

    return {
      ...nkrRow,
      EDDarstellung,
    };
  });

async function saveToCsvFile(data, outputFile) {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk(outputFile, {});
}

async function main() {
  const nkrDataArray = await readCSV(nkrDataInputFile);
  const toBeMergedDataArray = await readCSV(parsedDataInputFile);

  const mergedData = merge(nkrDataArray, toBeMergedDataArray);

  await saveToCsvFile(mergedData, outputPath + "merged.csv");
}

try {
  main();
} catch (err) {
  console.error(err);
}
