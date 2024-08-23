const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8001;
const OpenAI = require("openai");
const openai = new OpenAI();

app.listen(port);
app.use(express.json());
app.use(cors());

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
  {
    word: "eke out",
    synonyms: ["scrape out"],
  },
  {
    word: "eked out",
    synonyms: ["scraped out"],
  },
  {
    word: "eke out a living",
    synonyms: ["survive", "get by", "support oneself", "make ends meet"],
  },
  {
    word: "eked out a living",
    synonyms: ["survived", "got by", "supported oneself", "made ends meet"],
  },
  {
    word: "unequivocal",
    synonyms: [
      "unambiguous",
      "crystal clear",
      "clear",
      "plain",
      "obvious",
      "evident",
      "unmistakable",
      "undeniable",
    ],
  },
  {
    word: "eloquent",
    synonyms: [
      "persuasive",
      "expressive",
      "articulate",
      "fluent",
      "strong",
      "forceful",
      "powerful",
      "potent",
      "well spoken",
      "silver-tongued",
      "smooth-tongued",
      "well expressed",
      "graceful",
      "lucid",
      "vivid",
      "effective",
      "graphic",
      "glib",
    ],
  },
  {
    word: "quintessential",
    synonyms: [
      "typical",
      "prototypical",
      "stereotypical",
      "archetypal",
      "classic",
      "model",
      "essential",
      "standard",
      "stock",
      "representative",
      "true to type",
      "conventional",
      "ideal",
      "consummate",
      "exemplary",
      "best",
      "ultimate",
      "supreme",
      "absolute",
    ],
  },
  {
    word: "brobdingnagian",
    synonyms: [
      "huge",
      "gigantic",
      "enormous",
      "big",
      "large",
      "immense",
      "colossal",
      "massive",
      "tremendous",
      "gigantic",
      "large",
    ],
  },
  {
    word: "shall",
    synonyms: ["should"],
  },
  {
    word: "shan't",
    synonyms: ["should not", "shouldn't"],
  },
  {
    word: "venerable",
    synonyms: [
      "respected",
      "worshipped",
      "honored",
      "distinguished",
      "acclaimed",
      "celebrated",
      "renowned",
      "illustrious",
      "glorious",
      "legendary",
      "famed",
      "eminent",
      "preeminent",
      "great",
      "elevated",
      "prominent",
      "notable",
      "noted",
      "respectable",
      "reputable",
      "decent",
      "honorable",
      "worthy",
      "exemplary",
    ],
  },
  {
    word: "immaculate",
    synonyms: [
      "perfect",
      "clean",
      "spotless",
      "pristine",
      "pure",
      "flawless",
      "unstained",
    ],
  },
  {
    word: "prodigious",
    synonyms: [
      "great",
      "substantial",
      "considerable",
      "significant",
      "wonderful",
      "impressive",
      "remarkable",
      "exceptional",
      "extraordinary",
      "amazing",
      "astonishing",
      "astounding",
      "staggering",
      "stunning",
      "marvelous",
      "miraculous",
      "phenomenal",
      "breathtaking",
      "incredible",
      "unbelievable",
      "unreal",
      "striking",
      "unnatural",
      "monstrous",
      "grotesque",
      "abnormal",
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

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "ONLY grammatically correct the use of words. ONLY Return “Null” if everything’s correct. Else ONLY return the incorrect word and the corrected word like [“incorrect”, “correct”, “incorrect”, “correct”]",
      },
      {
        role: "user",
        content: `'${text}'`,
      },
    ],
  });

  if (completion.choices[0].message.content === "Null") {
    res.status(200).json({ result: text });
    return;
  }

  let incorrect = new Array(completion.choices[0].message.content);

  for (let i = 0; i < incorrect.length; ) {
    text = text.replace(incorrect[i], incorrect[i + 1]);
    i += 2;
  }

  res.status(200).json({ result: text });
});
