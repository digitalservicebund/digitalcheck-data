#!/bin/bash

set -uo pipefail

# Set locale for jq
LC_CTYPE=en_US.UTF-8
LC_ALL=en_US.UTF-8

TEST_RESOURCES="../resources/test/"
ACTUAL_RESULT_FILE="./output/actual-result.json"
EXPECTED_RESULT_FILE="./expected-result.json"

SCRIPT_DIR="$(dirname "$0")"

"$SCRIPT_DIR/../scripts/parse.sh" -i "$TEST_RESOURCES" -o "$ACTUAL_RESULT_FILE" -f "json" -n -c

if command -v colordiff &>/dev/null; then
    DIFF=$(colordiff --side-by-side <(jq . $ACTUAL_RESULT_FILE) <(jq . $EXPECTED_RESULT_FILE))
else
    DIFF=$(diff --side-by-side <(jq . $ACTUAL_RESULT_FILE) <(jq . $EXPECTED_RESULT_FILE))
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