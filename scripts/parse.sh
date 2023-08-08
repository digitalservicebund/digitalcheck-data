#!/bin/bash

export NODE_NO_WARNINGS=1

INPUT_PATH=""
OUTPUT_FILE=""
OUTPUT_FORMAT=""
OUTPUT_PATH="output"
ASK_TO_OPEN=true

_parse_options() {
  while getopts ":hi:o:f:n" option; do
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
  echo "-f                Output format (json or csv)"
  echo "-n                Do not open file in the end"
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
  output_file_txt="$OUTPUT_PATH/$input_file_name.txt"
  output_file_pdfa="$OUTPUT_PATH/$input_file_name.a.pdf"
  output_file_data="$OUTPUT_PATH/${input_file_name}_data.json"

  ./bash/convert.sh -i "$input_file" -o "$output_file_txt" -f "txt"
  ./bash/convert.sh -i "$input_file" -o "$output_file_pdfa" -f "pdfa"

  echo "Read checkboxes and radio buttons from $input_file"
  python ./python/extract-radios-and-checkboxes.py -i "$output_file_pdfa" -o "$output_file_data"
done

echo ""
echo "Merge data from all input files..."
node ./node/merge-all-data.js -i "$OUTPUT_PATH" -o "$OUTPUT_FILE" -f "$OUTPUT_FORMAT"

echo ""
echo "Saved data to $OUTPUT_FILE"
echo ""

if [ "$ASK_TO_OPEN" = true ] ; then
    while true; do
        read -p "Do you want to open $OUTPUT_FILE? [y/n]: " yn
        case $yn in
            [Yy]* ) open "$OUTPUT_FILE"; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
fi