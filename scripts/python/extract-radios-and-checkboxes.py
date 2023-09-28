import os
import json
import argparse
import pdfplumber

answers = {
    0: 'Ja',
    1: 'Nein',
    2: 'Teilweise',
    3: 'Nicht relevant',
}


def main():
    arguments = parse_arguments()
    create_output_directory(arguments['output_file'])
    parse_pdf(arguments['input_file'], arguments['output_file'])
    print("Successfully extracted data from " + arguments['input_file'])


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
        radio_button_data = {
            'ED1_Kommunikation_Frage': extract_answer_on_page(pdf.pages[12]),
            'ED2_Daten_Frage': extract_answer_on_page(pdf.pages[13]),
            'ED3_Datenschutz_Frage': extract_answer_on_page(pdf.pages[14]),
            'ED4_Klarheit_Frage': extract_answer_on_page(pdf.pages[15]),
            'ED5_Automatisierung_Frage': extract_answer_on_page(pdf.pages[16])
        }
        checkbox_answers = extract_pre_check_answers(pdf.pages[3])
        checkbox_data = {
            'VP1_ITLösung': checkbox_answers[0],
            'VP2_Verpflichtungen': checkbox_answers[1],
            'VP3_Datenaustausch': checkbox_answers[2],
            'VP4_Interaktion': checkbox_answers[3],
            'VP5_Automatisierung': checkbox_answers[4],
            'VP6_NichtVerbessert': checkbox_answers[5]
        }

        data = radio_button_data | checkbox_data

        save_to_json_file(data, output_file)


def save_to_json_file(data, output_file):
    json_file = open(output_file, "w")
    json_field = json.dumps(data)
    json_file.write(json_field)
    json_file.close()


def extract_pre_check_answers(page):
    checkboxes = [rect for rect in page.rects if rect["width"] < 10 and rect["height"] < 10]
    result = []

    for i, checkbox in enumerate(checkboxes):
        # Crop the page to contain just the checkbox rectangle.
        cropped = page.crop((checkbox["x0"], checkbox["top"], checkbox["x1"], checkbox["bottom"]))

        # If the cropped page has a character, it's the checkmark
        result.append(len(cropped.chars) > 0)

    return result


def extract_answer_on_page(page):
    radio_outline_y_positions = [curve['y0'] for curve in page.curves if curve["height"] > 8]
    if len(radio_outline_y_positions) == 0:
        return None
    radio_outline_y_positions.sort(reverse=True)

    radio_check_y_positions = [curve['y0'] for curve in page.curves if curve["height"] < 8]
    if len(radio_check_y_positions) > 1:
        print("ERROR: Too many checkmarks on page " + str(page.page_number)
              + ". Exactly one radio button must be checked.")
        return 'ERROR'
    elif len(radio_check_y_positions) < 1:
        return None

    checked_radio = find_checked_radio(radio_outline_y_positions, radio_check_y_positions[0])
    return answers[checked_radio]


def find_checked_radio(radio_outline_y_positions, radio_check_y_position):
    # Find radio button outline which is closest to the checkmark by calculating the distance of the y position
    closest = None
    distances = {}
    for i, radio_outline_y_position in enumerate(radio_outline_y_positions):
        distances[i] = abs(radio_outline_y_position - radio_check_y_position)
        if closest is None:
            closest = i
        else:
            if distances[i] < distances[closest]:
                closest = i
    return closest


if __name__ == "__main__":
    main()
