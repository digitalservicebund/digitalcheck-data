# Extract data from PDF documents

## Extract text from PDF

The `extract-data-from-txt.js` script can be used to extract data from text files.

### Install

```
npm i
```

### Usage

```
node extract-data-from-txt.js -i <path-to-input-path> -o <path-to-output-file>
```


## Extract JSON from PDF 

The `extract-data-from-pdf.js` script can be used to extract data from PDF files using the [Adobe PDF Services API](https://developer.adobe.com/document-services/docs/overview/pdf-services-api/).

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
node extract-data-from-pdf.js <path-to-pdf>
```

## Generate dummy data

The `generate-dummy-data.js` script can be used to generate dummy data. The data includes NKR metadata and 
data from the Digitalcheck documents.

### Install

```
npm i
```

### Usage

```
node generate-dummy-data.js
```