import csv
import json
import os

import texthero as hero
import pandas as pd
from texthero import preprocessing
from nltk.corpus import stopwords
from textblob import TextBlob
from itertools import zip_longest

NUM_TOP_WORDS = 10
OUTPUT_DIR = "output/"


def main():
    # Read data
    data = pd.read_csv(
        "../output/parsed-data.csv"
    )

    # Preprocess / clean data
    custom_cleaning = [preprocessing.fillna,
                       preprocessing.remove_punctuation,
                       preprocessing.remove_urls,
                       preprocessing.remove_whitespace]

    with open('order.json', 'r') as file:
        data_fields = json.load(file)

    top_words_per_field = get_top_words_per_field(custom_cleaning, data, data_fields)
    write_to_csv(convert_to_headers(data_fields), transpose_list(top_words_per_field), "top_words_per_field.csv")

    top_words_per_dc = get_top_words_per_dc(data, data_fields)
    write_to_csv(convert_to_headers(data['NKRNr'].values.tolist()), transpose_list(top_words_per_dc),
                 "top_words_per_dc.csv")


def get_top_words_per_dc(data, data_fields):
    top_words_per_dc = []
    for i, row in data.iterrows():
        dc_text = ""
        for field in data_fields:
            processed_field = field + '_clean'
            if row[processed_field]:
                dc_text = dc_text + row[processed_field]

        top_words = hero.visualization.top_words(pd.Series([dc_text], copy=False)).head(NUM_TOP_WORDS)
        top_words_per_dc.append(top_words.keys().tolist())
        top_words_per_dc.append(top_words.values.tolist())
    return top_words_per_dc


def get_top_words_per_field(custom_cleaning, data, data_fields):
    top_words_per_field = []
    for field in data_fields:
        processed_field = field + '_clean'
        data[processed_field] = data[field].pipe(hero.clean, custom_cleaning)

        data[processed_field] = data[processed_field].apply(clean_paragraphs)
        data[processed_field] = data[processed_field].apply(clean_egs)
        data['noun_phrases'] = data[processed_field].apply(extract_noun_phrases)
        data[processed_field] = data[processed_field].apply(replace_stopwords)

        # Find most used words
        top_words = hero.visualization.top_words(data[processed_field]).head(NUM_TOP_WORDS)

        top_words_per_field.append(top_words.keys().tolist())
        top_words_per_field.append(top_words.values.tolist())
    return top_words_per_field


def convert_to_headers(list):
    headers = []
    for element in list:
        prefix = str(element)
        headers.append(prefix + '_word')
        headers.append(prefix + '_count')
    return headers


def transpose_list(top_words_per_field):
    transposed_list = list(zip_longest(*top_words_per_field, fillvalue=''))
    return transposed_list


def write_to_csv(headers, rows, filename):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_DIR + filename, "w") as stream:
        writer = csv.writer(stream)
        writer.writerow(headers)
        for row in rows:
            writer.writerow(row)


def clean_paragraphs(x):
    return x.replace("§ ", "§")


def clean_egs(x):
    return x.replace(" z B ", " zB ")


def replace_stopwords(x):
    return ' '.join([word for word in x.split() if word not in stopwords.words('german')])


def extract_noun_phrases(x):
    frequent_phrases = {}
    phrases = TextBlob(x).noun_phrases
    for phrase in phrases:
        count = phrases.count(phrase)
        if len(phrase.split()) > 1:
            frequent_phrases[phrase] = count
    sorted_phrases = dict(sorted(frequent_phrases.items(), key=lambda item: item[1]))
    return sorted_phrases


if __name__ == "__main__":
    main()
