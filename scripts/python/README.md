# Parse PDF documents with Python

## Install

```
pipenv install
```

## Extract radion buttons and checkboxes

The `extract-radios-and-checkboxes.py` script can be used to extract answers on radio buttons and checkboxes 
from PDF files using [pdfplumber](https://github.com/jsvine/pdfplumber). The data output is stored into a JSON file. 

### Usage

```
 pipenv run python extract-radios-and-checkboxes.py -i <input-file> -o <output-file> 
```
*Note: Use `.pdf` as input and `.json` as output file format.*

## Extract text

The `extract-text.py` script can be used to extract text from PDF files using
[pypdf](https://pypdf.readthedocs.io/en/stable/index.html).

### Usage

```
 pipenv run python extract-text.py <input-file>
```
*Note: Use `.pdf` as input file format.*

## Process data

⚠️ **Warning:** This is work in process.

The `process-data.py` script can be used to process and analyse the data via NLP using
[Texthero](https://texthero.org/), [NLTK](https://www.nltk.org/) and [TextBlob](https://textblob.readthedocs.io/en/dev/).

### Usage

```
 pipenv run python process-data.py
```

