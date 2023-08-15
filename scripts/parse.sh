#!/bin/bash

set -euo pipefail

export NODE_NO_WARNINGS=1

INPUT_PATH=""
OUTPUT_FILE=""
OUTPUT_FORMAT=""
ASK_TO_OPEN=true
NUMBER_OF_FILES=0
TMP_DIR="tmp"
CLEAR_TMP_FILES=false

SCRIPT_DIR="$(dirname "$0")"

_parse_options() {
  while getopts ":hi:o:f:nc" option; do
    case $option in
      h)
        _help
        exit;;
      i)
        INPUT_PATH=$OPTARG;;
      o)
        OUTPUT_FILE=$OPTARG;;
      f)
        OUTPUT_FORMAT=$OPTARG;;
      n)
        ASK_TO_OPEN=false;;
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
  echo "-o                Output file"
  echo "-f                Output format (json or csv)"
  echo "-n                Do not open file in the end"
  echo "-c                Clear temporary files afterwards"
  echo "-h                Display help"
}

_parse_options "$@"

OUTPUT_DIR="$(dirname "${OUTPUT_FILE}")/$TMP_DIR"
mkdir -p "$OUTPUT_DIR"

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

  ((NUMBER_OF_FILES++))
  input_file_name="$(basename -- "$input_file")"
  input_file_name=${input_file_name%".pdf"}
  output_file_txt="$OUTPUT_DIR/$input_file_name.txt"
  output_file_pdfa="$OUTPUT_DIR/$input_file_name.a.pdf"
  output_file_data="$OUTPUT_DIR/${input_file_name}_data.json"

  "$SCRIPT_DIR/bash/convert.sh" -i "$input_file" -o "$output_file_txt" -f "txt"
  "$SCRIPT_DIR/bash/convert.sh" -i "$input_file" -o "$output_file_pdfa" -f "pdfa"

  echo "Read checkboxes and radio buttons from $input_file"
  python "$SCRIPT_DIR/python/extract-radios-and-checkboxes.py" -i "$output_file_pdfa" -o "$output_file_data"
done

echo ""
echo "Merge data from all input files..."
node "$SCRIPT_DIR/node/merge-all-data.js" -i "$OUTPUT_DIR" -o "$OUTPUT_FILE" -f "$OUTPUT_FORMAT" -n "$NUMBER_OF_FILES"

echo ""
echo "Saved data to $OUTPUT_FILE"
echo ""

if [ "$CLEAR_TMP_FILES" = true ] ; then
    rm -rf "$OUTPUT_DIR"
fi

if [ "$ASK_TO_OPEN" = true ] ; then
    while true; do
        read -rp "Do you want to open $OUTPUT_FILE? [y/n]: " yn
        case $yn in
            [Yy]* ) open "$OUTPUT_FILE"; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
fi