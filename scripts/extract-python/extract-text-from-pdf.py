from pypdf import PdfReader
import os
import json
import sys

# Create output directory if not existing
outputPath = "output"
isExist = os.path.exists(outputPath)
if not isExist:
    os.makedirs(outputPath)

# Read file from arguments
if len(sys.argv) < 2:
    print("At least one argument expected.")
    sys.exit()
inputFile = sys.argv[1]

# Create reader for file
reader = PdfReader(inputFile)
outputFilename = os.path.basename(inputFile)
outputFilename = outputFilename[:-4]

# Extract text
textFile = open(outputPath + "/" + outputFilename + ".txt", "w")
for page in reader.pages:
    textFile.write(page.extract_text())
textFile.close()

# Extract fields as JSON
jsonFile = open(outputPath + "/" + outputFilename + ".json", "w")
fields = reader.get_form_text_fields()
jsonField = json.dumps(fields)
jsonFile.write(jsonField)
jsonFile.close()

print("Done")
