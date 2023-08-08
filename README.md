# Digitalcheck Data

This repository contains scripts to automatically extract data from Digitalcheck documents (PDF) 
to be used for evaluation and analysis purposes.

⚠️ **Be warned:** Some scripts in this repository are work in progress.

## Overview

* The `scripts` directory contains the different scripts to parse Digitalcheck PDF documents.
* The `resources` directory contains the Digitalcheck PDF documents.

## Getting Started

*Warning: Not tested for Windows systems*

Follow the steps below to parse Digitalcheck PDF documents:

- Copy the PDF files into `resources/real/`
- Open a terminal in this root directory and run `./scripts/parse.sh`
- Type `y` when asked if the file should be opened or manually open `scripts/output/data.[json|csv]`

## Tooling 

The scripts in this repository make use of the following tools:

- [ghostscript](https://www.ghostscript.com/) to convert PDF to [PDF/A](https://en.wikipedia.org/wiki/PDF/A) 
- [xpdf](https://www.xpdfreader.com/) to convert PDF to text or PostScript
- [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/) to extract
data and interactive fields (only works with interactive PDF documents created with Adobe tooling)
- [pypdf](https://pypdf.readthedocs.io/en/stable/index.html) to extract text and interactive fields 
(only works if the interactive fields are still interactive and not rendered differently)
- [pdfplumber](https://github.com/jsvine/pdfplumber) to extract radio button and checkbox data by detecting 
rectangles and circles 

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
