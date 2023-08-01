#!/bin/bash

input_file=$1
file_name="$(basename -- $input_file)"
output_path="output/"

ps_output="${output_path}${file_name}.ps"
txt_output="${output_path}${file_name}.txt"
pdfa_output="${output_path}${file_name}_a.pdf"

mkdir -p output

# Convert to PostScript
pdftops "${input_file}" "${ps_output}"

# Convert to text
pdftotext -enc UTF-8 "${input_file}" "${txt_output}"

# Convert to PDF/A
gs -dPDFA -dBATCH -dNOPAUSE -dNOOUTERSAVE -dUseCIEColor -sProcessColorModel=DeviceCMYK -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 -sOutputFile="${pdfa_output}" "${ps_output}"