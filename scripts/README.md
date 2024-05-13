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
- pipenv: `pip install pipenv --user`
- if pipenv path is not set or pipenv cannot find python:
  - set pipenv as path variable
  - `pipenv --python python path/to/python`
- install pdfplumber: `pip install pdfplumber --user` 


### Install

```
cd node
npm i
cd ../python
pipenv install
```

### Usage

```
./parse.sh -i <input-path> -o <output-path> 
```

### Test

```
../test/test-parse.sh 
```

*Note: See [test/README.md](../test/README.md) for more info.* 

### Output

The output file includes the following data:

- **Titel_DC**: Title of the policy (Regelung),
- **Dateiname_DC**: Name of the original PDF document file,
- **Version_DC**: Version of the Digitalcheck document,
- **VP1_ITLösung**: Answer on question one of the pre-check on page 4 (true / false),
- **VP2_Verpflichtungen**: Answer on question two of the pre-check on page 4 (true / false),
- **VP3_Datenaustausch**: Answer on question three of the pre-check on page 4 (true / false),
- **VP4_Interaktion**: Answer on question four of the pre-check on page 4 (true / false),
- **VP5_Automatisierung**: Answer on question five of the pre-check on page 4 (true / false),
- **VP6_NichtVerbessert**: Answer on question six of the pre-check on page 4 (true / false)
- **VP_Erläuterung**: Textfield of the pre-check on page 4 (Vorprüfung),
- **ED_AuswirkungVollzug_Schritte**: Textfield for explanation of the impact on the execution on page 12 (Einfluss auf Vollzug),
- **ED_AuswirkungVollzug_Regelung**: Textfield for explanation of the impact on the policy on page 12 (Einfluss auf Regelung),
- **ED1_Kommunikation_Frage**: Answer on question regarding principle 1 on page 13,
- **ED1_Kommunikation_Erläuterung**: Textfield for explanation of answer on question regarding principle 1 on page 13,
- **ED2_Daten_Frage**: Answer on question regarding principle 2 on page 14,
- **ED2_Daten_Erläuterung**: Textfield for explanation of answer on question regarding principle 2 on page 14,
- **ED3_Datenschutz_Frage**: Answer on question regarding principle 3 on page 15,
- **ED3_Datenschutz_Erläuterung**: Textfield for explanation of answer on question regarding principle 3 on page 15,
- **ED4_Klarheit_Frage**: Answer on question regarding principle 4 on page 16,
- **ED4_Klarheit_Erläuterung**: Textfield for explanation of answer on question regarding principle 4 on page 16,
- **ED5_Automatisierung_Frage**: Answer on question regarding principle 5 on page 17,
- **ED5_Automatisierung_Erläuterung**: Textfield for explanation of answer on question regarding principle 5 on page 17,

