import {degrees, PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import * as fs from "node:fs";

// Read the PDF file as a buffer
fs.readFile('./dc-example.pdf', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Convert the buffer to a Uint8Array
    const existingPdfBytes = new Uint8Array(data);

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()

    // Draw a string of text diagonally across the first page
    firstPage.drawText('This text was added with JavaScript!', {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // You can also process the byteArray further as needed
    // For example, writing it to another file
    fs.writeFile('pdf-lib-modified.pdf', pdfBytes, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
});