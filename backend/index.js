const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8001;

app.listen(port);
app.use(express.json());

let dictionary = [
  //nouns
  { word: "thou", synonyms: ["you"] },
  { word: "thine", synonyms: ["your"] },
  { word: "thyself", synonyms: ["yourself"] },
  { word: "aught", synonyms: ["anything", "zero"] },
  { word: "thrice", synonyms: ["three times", "3 times"] },
  {
    word: "influx",
    synonyms: [
      "inflow",
      "inrush",
      "rush",
      "stream",
      "flood",
      "incursion",
      "ingress",
      "invasion",
      "intrusion",
    ],
  },
  {
    word: "paraphernailia",
    synonyms: [
      "equipment",
      "stuff",
      "things",
      "apparatus",
      "tackle",
      "kit",
      "implements",
      "tools",
      "utensils",
      "material",
      "materials",
      "appliances",
      "rig",
      "outfit",
      "accoutrements",
      "appurtenances",
      "impedimenta",
      "miscellaneous articles",
      "odds and ends",
      "bits and pieces",
      "bits and bobs",
      "trappings",
      "accessories",
      "rubbish",
      "gear",
      "junk",
      "traps",
    ],
  },
  {
    word: "zenith",
    synonyms: [
      "highest point",
      "high point",
      "crowning point",
      "peak",
      "maximum",
      "prime",
    ],
  },
  {
    word: "myriads of",
    synonyms: [
      "multitude of",
      "countless",
      "innumerable",
      "numerous",
      "a large number of",
      "a great number of",
      "a lot of",
      "loads of",
      "tons of",
      "hundreds of",
      "thousands of",
      "millions of",
      "billions of",
      "zillions of",
    ],
  },
  { word: "maxim", synonyms: ["saying", "motto", "slogan"] },
  { word: "a maxim", synonyms: ["a saying"] },
  { word: "the maxim", synonyms: ["the saying"] },
  //adjectives/verbes
  { word: "pulchritudinous", synonyms: ["beautiful"] },
  {
    word: "frivolous",
    synonyms: [
      "giddy",
      "silly",
      "foolish",
      "facetious",
      "zany",
      "lighthearted",
      "merry",
      "superficial",
      "shallow",
      "lacking seriousness",
      "nonserious",
      "light-minded",
      "whimsical",
      "skittish",
      "flighty",
      "irresponsible",
      "thoughtless",
      "lacking in sense",
      "featherbrained",
      "empty-headed",
      "peabrained",
      "birdbrained",
      "vacuous",
      "vapid",
      "dizzy",
      "dippy",
      "dopey",
      "nutty",
    ],
  },
  { word: "afternoonified", synonyms: ["smart", "refined", "sophisticated"] },
  { word: "arf'arf'an'arf", synonyms: ["intoxicated"] },
  {
    word: "anon",
    synonyms: [
      "soon",
      "shortly",
      "in a little while",
      "in a short time",
      "presently",
      "before long",
      "in the near future",
    ],
  },
];

for (item in dictionary) {
  let a = JSON.parse(JSON.stringify(dictionary[item]));
  a.word = a.word.charAt(0).toUpperCase() + a.word.slice(1);
  for (b in a.synonyms) {
    a.synonyms[b] =
      a.synonyms[b].charAt(0).toUpperCase() + a.synonyms[b].slice(1);
  }
  dictionary.push(a);
}

console.log("Server added capitalized words to dictionary.");

app.post("/fancyficate", async (req, res) => {
  let { text } = req.body;
  let backup = text;
  let changed = [];

  for (a in dictionary) {
    for (b in dictionary[a].synonyms) {
      text = text.replace(dictionary[a].synonyms[b], dictionary[a].word);

      if (text !== backup) {
        changed.push(dictionary[a].synonyms[b], dictionary[a].word);
        backup = text;
      }
    }
  }

  res.status(200).json({ result: text });
});
