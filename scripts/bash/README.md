# Convert PDF documents using command line tools

## Convert to Text, PDF/A or PostScript

The `convert.sh` script can be used to convert PDF files to other formats like PostScript, text and PDF/A.

### Prerequisites

- [xpdf](https://www.xpdfreader.com/) (for conversion to text or PostScript)
- [ghostscript](https://www.ghostscript.com/) (for conversion to PDF/A)

### Usage

```
./convert.sh -i <input-file> -o <output-file> -f <output-format>
```
*Note: Use one of the following formats: txt, ps, pdfa*

## Flatten 

The `flatten.sh` script can be used to flatten PDF documents (remove all interactive fields and replace with text / shapes).

### Prerequisites

- [qpdf](https://qpdf.readthedocs.io/en/)

### Usage

```
./flatten.sh -i <input-file> -o <output-file>
```
