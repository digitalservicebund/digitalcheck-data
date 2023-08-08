# Parse PDF documents with Node.JS

## Merge data from different sources 

The `merge-all-data.js` script can be used to merge data extracted from a PDF document by `../bash/convert.sh` (text)
and `../python/extract-radios-and-checkboxes.py` (JSON). The script iterates over all files in the given input path, 
extracts part of the text data using the upper and lower bounds specified in `bounds.json` and merges this data
with the extracted radio button and checkbox data. The merged data is stored in a file with one data row for each 
input PDF file. 

### Install

```
npm i
```

### Usage

```
node merge-all-data.js -i <path-to-input-path> -o <path-to-output-file> -f <output-format>
```
*Note: Use one of the following output formats: json, csv*

## Extract data via PDF Services API

The `extract-data.js` script can be used to extract data from PDF files using the [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/).

### Authentication

Before the samples can be run, set the environment variables `PDF_SERVICES_CLIENT_ID` and `PDF_SERVICES_CLIENT_SECRET` 
from the `pdfservices-api-credentials.json` file downloaded at the end of creation of credentials via 
[Get Started](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSdk) 
workflow by running the following commands :

```
export PDF_SERVICES_CLIENT_ID=<YOUR CLIENT ID>
export PDF_SERVICES_CLIENT_SECRET=<YOUR CLIENT SECRET>
```

### Install

```
npm i
```

### Usage

```
node extract-data.js <inout-file>
```

## Generate dummy data

The `generate-dummy-data.js` script can be used to generate dummy data. The data includes data from the Digitalcheck 
PDF documents and additional metadata.

### Install

```
npm i
```

### Usage

```
node generate-dummy-data.js
```
