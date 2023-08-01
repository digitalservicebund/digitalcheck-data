# Parse PDFs using Adobe PDF Services API

## Extract data from PDF

The `extract-data-from-pdf.js` script can be used to extract data from PDF files.

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
