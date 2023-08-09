import texthero as hero
import pandas as pd
from texthero import preprocessing
from nltk.corpus import stopwords
import matplotlib.pyplot as plt
from textblob import TextBlob

NUM_TOP_WORDS = 20


def main():
    # Read data
    data = pd.read_csv(
        "../output/data-nlp-test.csv"
    )

    # Preprocess / clean data
    custom_cleaning = [preprocessing.fillna,
                       preprocessing.remove_punctuation,
                       preprocessing.remove_urls,
                       preprocessing.remove_whitespace]
    data['text'] = data['text'].pipe(hero.clean, custom_cleaning)

    data['text'] = data['text'].apply(clean_paragraphs)
    data['text'] = data['text'].apply(clean_egs)
    data['noun_phrases'] = data['text'].apply(extract_noun_phrases)
    data['text'] = data['text'].apply(replace_stopwords)

    # print(data.to_string())

    # Find most used words
    top_words = hero.visualization.top_words(data['text']).head(NUM_TOP_WORDS)
    print(top_words.head(NUM_TOP_WORDS))
    top_words.plot.bar(rot=90, title="Top words")

    # Create word cloud plot
    hero.wordcloud(data.text, max_words=20)

    # Render all plots
    plt.show(block=True)


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
    print(sorted_phrases)
    return sorted_phrases


if __name__ == "__main__":
    main()
