# Scripts

## Overview 

This directory contains scripts to parse Digitalcheck PDF documents:

- `./parse.sh`: Utilizes different scripts to parse Digitalcheck PDF documents and extract data (more info below)
- `bash/`: Bash script to convert PDF documents to different formats using
  [ghostscript](https://www.ghostscript.com/) and [xpdf](https://www.xpdfreader.com/)
- `node/`: Node.js script(s) to extract JSON data from Digitalcheck PDF or text documents
  (e.g. using the [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/))
- `python/`: Python script(s) to extract data from PDF documents using
  [pypdf](https://pypdf.readthedocs.io/en/stable/index.html)

## Parse 

The `parse.sh` script can be used to parse all Digitalcheck PDF documents in a given directory and 
extract its data. It uses `bash/convert.sh` to convert the PDF document to text and to PDF/A, the 
`python/extract-radios-and-checkboxes.py` script to extract radio button and checkbox answers
and `node/merge-all-data.js` script to merge the data from different sources.

### Prerequisites

- [xpdf](https://www.xpdfreader.com/)
- [ghostscript](https://www.ghostscript.com/)
- [python](https://www.python.org/)

### Install

```
cd extract-node
npm i
```

### Usage

```
./parse.sh -i <input-path> -o <output-file> -f <output-format> 
```
