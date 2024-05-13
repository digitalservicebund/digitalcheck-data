#!/bin/bash

set -euo pipefail

export NODE_NO_WARNINGS=1

INPUT_PATH=""
OUTPUT_PATH=""
NUMBER_OF_FILES=0
TMP_DIR="tmp"
CLEAR_TMP_FILES=false

SCRIPT_DIR="$(dirname "$0")"

_parse_options() {
  while getopts ":hi:o:c" option; do
    case $option in
      h)
        _help
        exit;;
      i)
        INPUT_PATH=$OPTARG;;
      o)
        OUTPUT_PATH=$OPTARG;;
      c)
        CLEAR_TMP_FILES=true;;
      \?)
        echo "Error: Invalid option"
        _help
        exit;;
     esac
  done
}

_help() {
  echo "Usage: ./parse.sh"
  echo "Parse all PDF documents in the input directory and extract data into the output JSON file."
  echo ""
  echo "Available options:"
  echo "-i                Input path"
  echo "-o                Output path"
  echo "-c                Clear temporary files afterwards"
  echo "-h                Display help"
}

_parse_options "$@"

OUTPUT_DIR_TMP="$OUTPUT_PATH/$TMP_DIR"
mkdir -p "$OUTPUT_DIR_TMP"

echo "Converting all input files in $INPUT_PATH"
echo ""
INPUT_FILES="$INPUT_PATH*"
for input_file in $INPUT_FILES
do
  echo "Converting $input_file"

  if [[ $input_file != *".pdf" ]]
  then
    echo "Skip $input_file since it is not of type PDF.";
    continue
  fi

  NUMBER_OF_FILES=$((NUMBER_OF_FILES + 1))
  input_file_name="$(basename -- "$input_file")"
  input_file_name=${input_file_name%".pdf"}
  output_file_txt="$OUTPUT_DIR_TMP/$input_file_name.txt"
  output_file_pdfa="$OUTPUT_DIR_TMP/$input_file_name.a.pdf"
  output_file_data="$OUTPUT_DIR_TMP/${input_file_name}_data.json"

  "$SCRIPT_DIR/bash/convert.sh" -i "$input_file" -o "$output_file_txt" -f "txt"

  if [ -e "$output_file_pdfa" ]; then
      echo "Skip converting to PDF/A. File already exists."
  else
      "$SCRIPT_DIR/bash/convert.sh" -i "$input_file" -o "$output_file_pdfa" -f "pdfa"
  fi

  echo "Read checkboxes and radio buttons from $output_file_pdfa"
  python "$SCRIPT_DIR/python/extract-radios-and-checkboxes.py" -i "$output_file_pdfa" -o "$output_file_data"
done

echo ""
echo "Merge data from all input files..."
node "$SCRIPT_DIR/node/merge-all-data.js" -i "$OUTPUT_DIR_TMP" -o "$OUTPUT_PATH" -n "$NUMBER_OF_FILES"

echo ""
echo "Saved data to $OUTPUT_PATH"
echo ""

if [ "$CLEAR_TMP_FILES" = true ] ; then
    rm -rf "$OUTPUT_DIR_TMP"
fi