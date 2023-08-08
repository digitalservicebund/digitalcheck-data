# Scripts

## Overview 

This directory contains scripts to parse Digitalcheck PDF documents:

- `./parse.sh`: Utilizes different scripts to parse Digitalcheck PDF documents and extract data (more info below)
- `bash/`: Bash script to convert PDF documents to different formats using
  [ghostscript](https://www.ghostscript.com/) and [xpdf](https://www.xpdfreader.com/)
- `node/`: Node.js script(s) to extract JSON data from Digitalcheck PDF or text documents
  (e.g. using the [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/))
- `python/`: Python script(s) to extract data from PDF documents using
  [pypdf](https://pypdf.readthedocs.io/en/stable/index.html) and [pdfplumber](https://github.com/jsvine/pdfplumber)

## Parse 

The `parse.sh` script can be used to parse all Digitalcheck PDF documents in a given directory and 
extract its data. It runs the following steps:
1. Convert the PDF document to text and PDF/A using `bash/convert.sh` 
2. Extract radio button and checkbox answers using It uses `python/extract-radios-and-checkboxes.py`
3. Merge the data from different sources using `node/merge-all-data.js`

### Prerequisites

- [xpdf](https://www.xpdfreader.com/)
- [ghostscript](https://www.ghostscript.com/)
- [python](https://www.python.org/)

### Install

```
cd node
npm i
cd ../python
pipenv install
```

### Usage

```
./parse.sh -i <input-path> -o <output-file> -f <output-format> 
```

### Output

The output file includes the following data:

- **dcVersion**: Version of the Digitalcheck document,
- **dcFileName**: Name of the original PDF document file,
- **title**: Title of the policy (Regelung),
- **preCheckExplanation**: Textfield of the pre-check on page 4 (Vorprüfung),
- **impactOnExecution**: Textfield for explanation of the impact on the execution on page 12 (Einfluss auf Vollzug),
- **impactOnRule**: Textfield for explanation of the impact on the policy on page 12 (Einfluss auf Regelung),
- **principle1Explanation**: Textfield for explanation of answer on question regarding principle 1 on page 13,
- **principle2Explanation**: Textfield for explanation of answer on question regarding principle 2 on page 14,
- **principle3Explanation**: Textfield for explanation of answer on question regarding principle 3 on page 15,
- **principle4Explanation**: Textfield for explanation of answer on question regarding principle 4 on page 16,
- **principle5Explanation**: Textfield for explanation of answer on question regarding principle 5 on page 17,
- **principle1Radio**: Answer on question regarding principle 1 on page 13,
- **principle2Radio**: Answer on question regarding principle 2 on page 14,
- **principle3Radio**: Answer on question regarding principle 3 on page 15,
- **principle4Radio**: Answer on question regarding principle 4 on page 16,
- **principle5Radio**: Answer on question regarding principle 5 on page 17,
- **preCheck1**: Answer on question one of the pre-check on page 4 (true / false),
- **preCheck2**: Answer on question two of the pre-check on page 4 (true / false),
- **preCheck3**: Answer on question three of the pre-check on page 4 (true / false),
- **preCheck4**: Answer on question four of the pre-check on page 4 (true / false),
- **preCheck5**: Answer on question five of the pre-check on page 4 (true / false),
- **preCheck6**: Answer on question six of the pre-check on page 4 (true / false)