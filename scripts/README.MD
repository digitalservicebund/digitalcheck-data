# Scripts

## Overview 

This directory contains scripts to parse PDF documents:

- `parse.sh`: Parse PDF documents and extract JSON data (using the `convert/convert.sh` and `extract-node/extract-data-from-text.js`)
- `convert/`: Bash script to convert PDF documents to different formats using
  [ghostscript](https://www.ghostscript.com/) and [xpdf](https://www.xpdfreader.com/)
- `extract-node/`: Node.js script(s) to extract JSON data from Digitalcheck PDF or text documents
  (e.g. using the [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/))
- `extract-python/`: Python script(s) to extract data from PDF documents using
  [pypdf](https://pypdf.readthedocs.io/en/stable/index.html)

## Parse 

Parse all Digitalcheck PDF documents in a given directory.

### Prerequisites

- [xpdf](https://www.xpdfreader.com/)

### Install

```
cd extract-node
npm i
```

### Usage

```
./parse.sh -i <input-path> -o <output-file>
```