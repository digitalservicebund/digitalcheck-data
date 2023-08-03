#!/bin/bash

export NODE_NO_WARNINGS=1

INPUT_PATH=""
OUTPUT_FILE=""
TXT_OUTPUT_PATH="output"

_parse_options() {
  while getopts ":hi:o:" option; do
    case $option in
      h)
        _help
        exit;;
      i)
        INPUT_PATH=$OPTARG;;
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
  echo "Usage: ./parse.sh"
  echo "Parse all PDF documents in the inout directory and extract data into the output JSON file."
  echo ""
  echo "Available options:"
  echo "-i                Input path"
  echo "-o                Output file"
  echo "-h                Display help"
}

_parse_options "$@"

OUTPUT_DIR="$(dirname "${OUTPUT_FILE}")"
mkdir -p "$OUTPUT_DIR"

echo "Converting all input files in $INPUT_PATH"
echo ""
INPUT_FILES="$INPUT_PATH*"
for input_file in $INPUT_FILES
do
  echo "Converting $input_file"

  input_file_name="$(basename -- "$input_file")"
  input_file_name=${input_file_name%".pdf"}
  output_file="$TXT_OUTPUT_PATH/$input_file_name.txt"

  ./convert/convert.sh -i "$input_file" -o "$output_file" -f "txt"
done

echo ""
echo "Extracting data from all inout_files..."
node ./extract-node/extract-data-from-txt.js -i "$TXT_OUTPUT_PATH" -o "$OUTPUT_FILE"

echo ""
echo "Done"