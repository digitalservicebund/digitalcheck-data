#!/bin/bash

set -uo pipefail

# Set locale for jq
LC_CTYPE=en_US.UTF-8
LC_ALL=en_US.UTF-8

TEST_RESOURCES="../resources/test/"
RESULT_DIR="./output/"
EXPECTED_RESULT_FILE="./expected-result.json"

SCRIPT_DIR="$(dirname "$0")"

"$SCRIPT_DIR/../scripts/parse.sh" -i "$TEST_RESOURCES" -o "$RESULT_DIR" -c

if command -v colordiff &>/dev/null; then
    DIFF=$(colordiff --side-by-side <(jq . "$RESULT_DIR/parsed-data.json") <(jq . $EXPECTED_RESULT_FILE))
else
    DIFF=$(diff --side-by-side <(jq . "$RESULT_DIR/parsed-data.json") <(jq . $EXPECTED_RESULT_FILE))
fi

echo ""
echo "--- TEST RESULT ---"

if [ -n "$DIFF" ]; then
  echo ""
  echo "FAILED. The actual result (right) does not match the expected (left):"
  echo ""
  echo "$DIFF"
else
  echo "SUCCESS"
fi