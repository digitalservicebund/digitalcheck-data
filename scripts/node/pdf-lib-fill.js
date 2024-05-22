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

    // Get the form containing all the fields
    const form = pdfDoc.getForm()

    let fields = form.getFields();
    fields.forEach(field => {
        console.log(field.getName());
        // console.log(field);
    })

    // Get all fields in the PDF by their names
    const nameField = form.getTextField('Regelung - Vorprüfung')
    const vp1 = form.getCheckBox('Vorprüfung positiv - 1')
    const vp2 = form.getCheckBox('Vorprüfung positiv - 3')
    const rb1 = form.getRadioGroup('Digitale Kommunikation')

    // Fill in the basic info fields
    nameField.setText('Dieses Feld wurde mit pdf-lib ausgefüllt.')

    // Checkbox
    vp1.check()
    vp2.check()

    // Radio Button
    rb1.select("Ja")

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // You can also process the byteArray further as needed
    // For example, writing it to another file
    fs.writeFile('pdf-lib-filled.pdf', pdfBytes, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
});