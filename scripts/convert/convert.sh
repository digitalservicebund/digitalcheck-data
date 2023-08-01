#!/bin/bash

pdf_input=$1
ps_output=${pdf_input%.*}.ps
txt_output=${pdf_input%.*}.txt
pdfa_output=${pdf_input%.*}_a.pdf

# Convert to PostScript
pdftops ${pdf_input} ${ps_output}

# Convert to text
pdftotext -enc UTF-8 ${pdf_input} ${txt_output}

# Convert to PDF/A
gs -dPDFA -dBATCH -dNOPAUSE -dNOOUTERSAVE -dUseCIEColor -sProcessColorModel=DeviceCMYK -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 -sOutputFile=${pdfa_output} ${ps_output}