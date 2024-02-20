# Digitalcheck Data

This repository contains scripts to automatically extract data from Digitalcheck documents (PDF) 
to be used for evaluation and analysis purposes.

⚠️ **Be warned:** Some scripts in this repository are work in progress.

## Getting Started

*Warning: Not tested for Windows systems*

Follow the steps below to parse Digitalcheck PDF documents:

- Copy the PDF files into `resources/real/`
- Install all prerequisites
  - Go to `scripts/node/` and run `npm i`
  - Install [ghostscript](https://www.ghostscript.com/) by running `brew install ghostscript`
  - Install [xpdf](https://www.xpdfreader.com/) by running `brew install xpdf`
  - Follow the installation guide in [scripts/python/README.md](./scripts/python/README.md)
- Open a terminal in this root directory and run `./scripts/parse.sh -i "./resources/real/" -o "output/"`

## Overview

* The `scripts` directory contains the different scripts to parse Digitalcheck PDF documents.
* The `resources` directory contains the Digitalcheck PDF documents.
* The `test` directory contains tests to test the scripts.

## Tooling 

The scripts in this repository make use of the following languages and tools:

### Bash / Command Line

- [ghostscript](https://www.ghostscript.com/) to convert PDF to [PDF/A](https://en.wikipedia.org/wiki/PDF/A) 
- [xpdf](https://www.xpdfreader.com/) to convert PDF to text or PostScript

### Node.JS

- [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/) to extract
data and interactive fields (only works with interactive PDF documents created with Adobe tooling)

### Python

- [pypdf](https://pypdf.readthedocs.io/en/stable/index.html) to extract text and interactive fields 
(only works if the interactive fields are still interactive and not rendered differently)
- [pdfplumber](https://github.com/jsvine/pdfplumber) to extract radio button and checkbox data by detecting 
rectangles and circles 

## Learnings about Parsing PDFs

*Note: Please consider those learnings personal learning after some trial and error with 
a few tools in a limited time frame. It is not complete and might differ for other use cases.*

### Interactive Fields

- Content of interactive fields is not detected by all tools when extracting text (e.g. PDF Extract API omits it).
  - e.g. [xpdf](https://www.xpdfreader.com/) reliably extracts text from fields no matter what format
- Reading interactive fields as fields (not plain text) is only possible if the fields are still interactive 
and not rendered by another PDF rendering engine (e.g. PDFium) or converted to PDF/A.
  - e.g. [pypdf](https://pypdf.readthedocs.io/en/stable/index.html) can extract fields as data (see [extract-text.py](./scripts/python/extract-text.py))

### Radio Buttons and Checkboxes

- None of the tested [tools](#Tooling) was able to detect and read data from radio buttons and checkboxes out of the box.
- To make it work, pdfplumber was used to detect circles and rectangles and do some calculations
to find out which one was checked (as done in 
[extract-radios-and-checkboxes.py](./scripts/python/extract-radios-and-checkboxes.py) 
inspired by [this GitHub issue](https://github.com/jsvine/pdfplumber/discussions/738)).

### PDF/A

- [PDF/A](https://en.wikipedia.org/wiki/PDF/A) is a standardized PDF format.
- Extracting text from PDF/A does not reliably include all text of the original PDF 
when extracted with the tested tools.
- PDF/A helps to reliably detect shapes like rectangles and circles.

### Tools

- There is a ton of OSS tools to parse PDF documents all with different features.
- Python seems to be the most suitable option for PDF parsing.
- The [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/)
has many features to execute CRUD operations on PDF documents, lacks reliability to parse PDF documents 
not created with Adobe tooling though.

## Contributing

🇬🇧  
Everyone is welcome to contribute the development of the _Digitalcheck Data_. You can contribute by opening pull request, 
providing documentation or answering questions or giving feedback. Please always follow the guidelines and our 
[Code of Conduct](CODE_OF_CONDUCT.md).

🇩🇪  
Jede:r ist herzlich eingeladen, die Entwicklung des _Digitalcheck Data_ mitzugestalten. Du kannst einen Beitrag leisten, 
indem du Pull-Requests eröffnest, die Dokumentation erweiterst, Fragen beantwortest oder Feedback gibst. 
Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT_DE.md).

## Contributing code
🇬🇧   
Open a pull request with your changes and it will be reviewed by someone from the team. When you submit a pull request, 
you declare that you have the right to license your contribution to the DigitalService and the community. 
By submitting the patch, you agree that your contributions are licensed under the MIT license.

Please make sure that your changes have been tested before submitting a pull request.

🇩🇪  
Nach dem Erstellen eines Pull Requests wird dieser von einer Person aus dem Team überprüft. Wenn du einen Pull-Request 
einreichst, erklärst du dich damit einverstanden, deinen Beitrag an den DigitalService und die Community zu 
lizenzieren. Durch das Einreichen des Patches erklärst du dich damit einverstanden, dass deine Beiträge unter der 
MIT-Lizenz lizenziert sind.

Bitte stelle sicher, dass deine Änderungen getestet wurden, bevor du einen Pull-Request sendest.
