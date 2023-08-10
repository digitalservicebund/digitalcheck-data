#!/bin/bash

set -euo pipefail

INPUT_FILE=""
OUTPUT_FILE=""

_parse_options() {
  while getopts ":hi:o:" option; do
    case $option in
      h)
        _help
        exit;;
      i)
        INPUT_FILE=$OPTARG;;
      o)
        OUTPUT_FILE=$OPTARG;;
      \?)
        echo "Error: Invalid option"
        _help
        exit;;
     esac
  done
}

_help() {
  echo "Usage: ./convert.sh"
  echo "Flatten PDF documents (remove all interactive fields and replace with text / shapes)."
  echo ""
  echo "Available options:"
  echo "-i                Input file"
  echo "-o                Output file"
  echo "-h                Display help"
}

_parse_options "$@"

OUTPUT_DIR="$(dirname "${OUTPUT_FILE}")"
mkdir -p "$OUTPUT_DIR"

qpdf --flatten-annotations=all "$INPUT_FILE" "$OUTPUT_FILE"