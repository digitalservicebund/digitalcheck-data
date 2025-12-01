import json
from io import TextIOWrapper
from typing import List, Dict

"""
Loads output/parsed-data.json and transforms the content into a set of Markdown files, for better LLM processing.
"""

# mappings from question keys to question text
base_questions = {
    "VP_Erläuterung": "Erläuterung, warum der Vollzug der Regelung voraussichtlich nicht durch digitale Möglichkeiten verbessert oder erleichtert wird",
    "ED_AuswirkungVollzug_Schritte": "Welche Schritte haben Sie unternommen, um zu prüfen, ob die Auswirkungen der Regelung den Bedürfnissen der Betroffenen und des Vollzugs entspricht?",
    "ED_AuswirkungVollzug_Regelung": "Wie spiegeln sich die Erkenntnisse, die durch die oben genannten Schritte gewonnen wurden, in der Regelung wider?",
}

principle_questions = {
    "ED1_Kommunikation": "Schafft die Regelungen die Voraussetzungen für eine digitale Kommunikation?",
    "ED2_Daten": "Schafft die Regelung die Voraussetzungen für eine Wiederverwendung von Daten und Standards?",
    "ED3_Datenschutz": "Schafft die Regelung die Voraussetzungen für eine Gewährleistung von Datenschutz und Informationssicherheit?",
    "ED4_Klarheit": "Enthält das Vorhaben klare Regelungen für eine digitale Ausführung?",
    "ED5_Automatisierung": "Ermöglicht die Regelung die Automatisierung des Vollzugs?",
}


def write_combined_file(filename: str, items: List[Dict[str, str]]) -> None:
    with open(filename, "w") as markdown_file:
        markdown_file.write("# Dokumentationen Digitalcheck\n\n")

        for item in items:
            write_item(item, markdown_file)


def write_item(item: dict[str, str], file: TextIOWrapper):
    file.write("## " + item["Titel_DC"] + "\n\n")
    if item["NKRNr"]:
        file.write(f"NKR-Nummer: {item["NKRNr"]}\n\n")

    for [question_key, question_description] in base_questions.items():
        answer = item.get(question_key, None)
        level = 4 if question_key == "ED_AuswirkungVollzug_Regelung" else 3
        if answer:
            prefix = "#" * level
            file.write(f"{prefix} {question_description}\n\n{answer}\n\n")

    for principle_key, question_description in principle_questions.items():
        yes_no = item.get(principle_key + "_Frage", None)
        description = item.get(principle_key + "_Erläuterung", None)
        if yes_no or description:
            body = "\n\n".join(filter(lambda x: x, [yes_no, description]))
            file.write(f"### {question_description}\n\n{body}\n\n")


if __name__ == "__main__":
    with open("output/parsed-data.json", "r") as f:
        data = json.load(f)
    write_combined_file(filename="output/digitalchecks.md", items=data)
    write_combined_file(filename="output/digitalchecks_negativ.md", items=[item for item in data if item["VP_Erläuterung"]])
    write_combined_file(filename="output/digitalchecks_positiv.md", items=[item for item in data if not item["VP_Erläuterung"]])
