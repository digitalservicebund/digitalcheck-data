#!/bin/bash

INPUT_FILE=""
OUTPUT_FILE=""
OUTPUT_FORMAT=""

_parse_options() {
  while getopts ":hi:o:f:" option; do
    case $option in
      h)
        _help
        exit;;
      i)
        INPUT_FILE=$OPTARG;;
      o)
        OUTPUT_FILE=$OPTARG;;
      f)
        OUTPUT_FORMAT=$OPTARG;;
      \?)
        echo "Error: Invalid option"
        _help
        exit;;
     esac
  done
}

_help() {
  echo "Usage: ./convert.sh"
  echo "Convert the given PDF document into another format (supported are text, PDF/A and PostScript)."
  echo ""
  echo "Available options:"
  echo "-i                Input file"
  echo "-o                Output file"
  echo "-f                Output file format (txt, pdfa, ps)"
  echo "-h                Display help"
}

_parse_options "$@"

OUTPUT_DIR="$(dirname "${OUTPUT_FILE}")"
mkdir -p "$OUTPUT_DIR"

case $OUTPUT_FORMAT in
  txt)
    # Convert to text
    pdftotext -enc UTF-8 "${INPUT_FILE}" "${OUTPUT_FILE}"
    ;;

  ps)
    # Convert to PostScript
    pdftops "${INPUT_FILE}" "${OUTPUT_FILE}"
    ;;

  pdfa)
    # Convert to PDF/A
    gs -q -dPDFA -dBATCH -dNOPAUSE -dNOOUTERSAVE -sProcessColorModel=DeviceCMYK -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 -sOutputFile="${OUTPUT_FILE}" "${INPUT_FILE}"
    ;;

  *)
    echo "Use one of the following formats: txt, ps, pdfa"
    ;;
esac