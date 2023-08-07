import os
import json
import sys
import argparse
import pdfplumber

answers = {
    0: 'Ja',
    1: 'Nein',
    2: 'Teilweise',
    3: 'Nicht relevant',
}


def parse_arguments():
    parser = argparse.ArgumentParser(description="Just an example",
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("-i", "--input-file", help="Input file")
    parser.add_argument("-o", "--output-file", help="Output file")
    args = parser.parse_args()
    return vars(args)


def create_output_directory(output_file):
    output_path = os.path.dirname(output_file)
    if not os.path.exists(output_path):
        os.makedirs(output_path)


def parse_pdf(input_file, output_file):
    with pdfplumber.open(input_file) as pdf:
        data = {
            'principle1Radio': extract_answer_on_page(pdf.pages[12]),
            'principle2Radio': extract_answer_on_page(pdf.pages[13]),
            'principle3Radio': extract_answer_on_page(pdf.pages[14]),
            'principle4Radio': extract_answer_on_page(pdf.pages[15]),
            'principle5Radio': extract_answer_on_page(pdf.pages[16])
        }

        json_file = open(output_file, "w")
        json_field = json.dumps(data)
        json_file.write(json_field)
        json_file.close()


def extract_answer_on_page(page):
    radio_outline_y_positions = [curve['y0'] for curve in page.curves if curve["height"] > 8]
    if len(radio_outline_y_positions) == 0:
        return None
    radio_outline_y_positions.sort(reverse=True)
    radio_check_y_positions = [curve['y0'] for curve in page.curves if curve["height"] < 8]
    if len(radio_check_y_positions) > 1:
        print("Too many checks.")
        sys.exit()
    checked_radio = find_checked_radio(radio_outline_y_positions, radio_check_y_positions[0])
    return answers[checked_radio]


def find_checked_radio(radio_outline_y_positions, radio_check_y_position):
    nearest = None
    distances = {}
    for i, radio_outline in enumerate(radio_outline_y_positions):
        distances[i] = abs(radio_outline - radio_check_y_position)
        if nearest is None:
            nearest = i
        else:
            if distances[i] < distances[nearest]:
                nearest = i
    return nearest


arguments = parse_arguments()
create_output_directory(arguments['output_file'])
parse_pdf(arguments['input_file'], arguments['output_file'])

print("Done")
