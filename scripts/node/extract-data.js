/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const decompress = require("decompress");
const fs = require('fs');

const outputPath = "output/";
const jsonPath = outputPath + "json/";
let inputFile = 'resources/test/dc-example_1_default.pdf';

try {
    if (process.argv.length === 2) {
        console.error('Expected at least one argument!');
        process.exit(1);
    }
    inputFile = process.argv[2]

    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .servicePrincipalCredentialsBuilder()
        .withClientId(process.env.PDF_SERVICES_CLIENT_ID)
        .withClientSecret(process.env.PDF_SERVICES_CLIENT_SECRET)
        .build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Build extractPDF options
    const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT).build()

    // Create a new operation instance.
    const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
        input = PDFServicesSdk.FileRef.createFromLocalFile(
            inputFile,
            PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
        );

    // Set operation input from a source file.
    extractPDFOperation.setInput(input);

    // Set options
    extractPDFOperation.setOptions(options);

    //Generating a file name
    let outputFilePath = createOutputFilePath();

    extractPDFOperation.execute(executionContext)
        .then(result => {
            result.saveAsFile(outputFilePath).then(() => {
                parseAndFormatData();
            })
        })
        .catch(err => {
            if(err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });

    // Generates a string containing a directory structure and file name for the output file.
    function createOutputFilePath() {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
            ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
        return (outputPath + "/zip/extract" + dateString + ".zip");
    }

    function parseAndFormatData() {
        decompress(outputFilePath, jsonPath).then(() => {
            readJSONData();
        })
    }

    function readJSONData() {
        fs.readFile(jsonPath + "structuredData.json", (err, data) => {
            if (err) throw err;
            let dataJson = JSON.parse(data);
            let elements = dataJson.elements;
            formatData(elements);

            let result = {
                ...parseTitle(elements),
                ...parsePreCheck(elements),
                ...parseImpactOnAffected(elements),
                ...parsePrinciple(elements, 12),
                ...parsePrinciple(elements, 13),
                ...parsePrinciple(elements, 14),
                ...parsePrinciple(elements, 15),
                ...parsePrinciple(elements, 16)
            }

            console.log(result);
        });
    }

    function formatData(elements) {
        elements.forEach(element => {
            delete element.ClipBounds
            delete element.Bounds
            delete element.Font
            // delete element.HasClip
            delete element.Lang
            delete element.TextSize
            delete element.attributes
        })
    }

    function parseTitle(elements) {
        return {
            "title": getElementTextAfter(elements, "Titel der Regelung")
        }
    }

    function parsePreCheck(elements) {
        let index = getIndexByText(elements, "voraussichtlich:");
        return {
            "preCheck": {
                [elements[index + 2].Text]: elements[index + 1].HasClip || false,
                [elements[index + 4].Text]: elements[index + 3].HasClip || false,
                [elements[index + 6].Text]: elements[index + 5].HasClip || false,
                [elements[index + 8].Text]: elements[index + 7].HasClip || false,
                [elements[index + 10].Text]: elements[index + 9].HasClip || false,
                [elements[index + 13].Text]: elements[index + 12].HasClip || false,
            }
        }
    }

    function parseImpactOnAffected(elements) {
        let index = getIndexByText(elements, "formelle Beteiligungsverfahren.");
        return {
            [elements[index-1].Text]: elements[index+1].Text,
            [elements[index+2].Text]: elements[index+3].Text
        }
    }

    function parsePrinciple(elements, page) {
        let filtered = elements.filter(element => element.Page === page);
        let fromIndex = getIndexByText(filtered, "uterung:");
        let sliced = filtered.slice(fromIndex+1);
        if (page === 16) {
            sliced = sliced.slice(0, -5);
        }
        let textField = "";
        sliced.forEach(element => textField += element.Text)
        return {
            [filtered[fromIndex-11].Text]: textField
        }
    }

    function getElementTextAfter(elements, textBefore) {
        let index = getIndexByText(elements, textBefore);
        return elements[index+1].Text
    }

    function getIndexByText(elements, text) {
        return elements.findIndex(element => element.hasOwnProperty('Text') && element.Text.includes(text));
    }

} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
