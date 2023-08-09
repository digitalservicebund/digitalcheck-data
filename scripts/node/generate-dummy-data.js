import ObjectsToCsv from "objects-to-csv";
import { LoremIpsum } from "lorem-ipsum";

const departments = ["BMI", "BMJ", "BMDV", "BMF", "BMUV", "BMWK", "BMEL", "BMG", "BMWSB", "BMAS", "AA", "BMFSJ", "BMBF", "BMZ"];
const type = ["Verordnung", "Gesetz"];
const answers = ["Ja", "Nein", "Teilweise", "Nicht relevant"];
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

let nkrNrCounter = 1;

try {
    let data = [];
    for (let i = 0; i < 50; i++) {
        data.push(generateRow());
    }

    const csv = new ObjectsToCsv(data);
    await csv.toDisk('output/data.csv');
} catch (err) {
    console.error(err);
}

function generateRow() {
    let element = {
        nkrNr: nkrNrCounter,
        department: getRandomElementOf(departments),
        type: getRandomElementOf(type),
        dateRuleReceived: getRandomDate(),
        datePreCheckReceived: getRandomDate(),
        dateDCReceived: getRandomDate(),
        dcVersion: '1.2',
        dcFileName: getRandomTextInRange(2, 4).replace(" ", "_") + ".pdf",

        title: getRandomTextInRange(2, 8),

        impactOnExecution: getRandomText(),
        impactOnRule: getRandomText(),

        preCheck1: getRandomBoolean(),
        preCheck2: getRandomBoolean(),
        preCheck3: getRandomBoolean(),
        preCheck4: getRandomBoolean(),
        preCheck5: getRandomBoolean(),
        preCheck6: getRandomBoolean(),

        principle1Radio: getRandomElementOf(answers),
        principle1Explanation: getRandomText(),
        principle2Radio: getRandomElementOf(answers),
        principle2Explanation: getRandomText(),
        principle3Radio: getRandomElementOf(answers),
        principle3Explanation: getRandomText(),
        principle4Radio: getRandomElementOf(answers),
        principle4Explanation: getRandomText(),
        principle5Radio: getRandomElementOf(answers),
        principle5Explanation: getRandomText(),
    }

    nkrNrCounter++;

    return element;
}

function getRandomElementOf(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate() {
    return getRandomDateInRange(100);
}
function getRandomDateInRange(rangeInDays) {
    let date = new Date(Date.now());
    date.setDate(date.getDate() - Math.floor(Math.random() * rangeInDays));
    return date.toJSON();
}

function getRandomBoolean() {
    return Math.random() < 0.5;
}

function getRandomText() {
    return getRandomTextInRange(5, 50);
}
function getRandomTextInRange(minWords, maxWords) {
    return lorem.generateWords(Math.floor(Math.random() * (maxWords - minWords)) + minWords);
}