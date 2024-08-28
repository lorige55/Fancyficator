const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8001;
const OpenAI = require("openai");
const openai = new OpenAI();
var fs = require("fs");

app.listen(port);
app.use(express.json());
app.use(cors());

let dictionary = require("./dictionary.json");

function capitalizeDictionary() {
  let dictionaryCopy = require("./dictionary.json");
  for (item in dictionaryCopy) {
    let a = JSON.parse(JSON.stringify(dictionaryCopy[item]));
    a.word = a.word.charAt(0).toUpperCase() + a.word.slice(1);
    for (b in a.synonyms) {
      a.synonyms[b] =
        a.synonyms[b].charAt(0).toUpperCase() + a.synonyms[b].slice(1);
    }
    dictionaryCopy.push(a);
  }
  dictionaryCopy = JSON.stringify(dictionaryCopy);
  fs.writeFile("./dictionary.json", dictionaryCopy, "utf8", function (err) {
    if (err) throw err;
    console.log("complete");
  });
  console.log("Server added capitalized words to dictionary.");
}

app.post("/fancyficate", async (req, res) => {
  let { text, vocabulary, spelling, grammar } = req.body;
  let changed = [];

  if (spelling) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Correct the spelling. Return “Null” if everything’s correct. Else return the misspelled word and the corrected word in this syntax: “misspelled”, “correct”, “misspelled”, “correct”.",
        },
        {
          role: "user",
          content: `'${text}'`,
        },
      ],
    });

    if (completion.choices[0].message.content !== "Null") {
      let incorrect = completion.choices[0].message.content.split('", "');
      incorrect = incorrect.map((item) => item.replace(/['"]+/g, ""));
      for (let i = 0; i < incorrect.length; ) {
        text = text.replace(incorrect[i], incorrect[i + 1]);
        changed.push({
          new: incorrect[i + 1],
          old: incorrect[i],
          process: "spelling",
        });
        i += 2;
      }
    }
  }

  if (vocabulary) {
    let backup = text;
    for (a in dictionary) {
      for (b in dictionary[a].synonyms) {
        text = text.replace(dictionary[a].synonyms[b], dictionary[a].word);
        if (text !== backup) {
          changed.push({
            new: dictionary[a].word,
            old: dictionary[a].synonyms[b],
            process: "vocab",
          });
          backup = text;
        }
      }
    }
  }

  if (grammar) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Correct the grammar. Return “Null” if everything’s correct. Else return the incorrect word/phrase and the corrected version in this syntax: “incorrect”, “correct”, “incorrect”, “correct”.",
        },
        {
          role: "user",
          content: `'${text}'`,
        },
      ],
    });

    if (completion.choices[0].message.content !== "Null") {
      let incorrect = completion.choices[0].message.content.split('", "');
      incorrect = incorrect.map((item) => item.replace(/['"]+/g, ""));
      for (let i = 0; i < incorrect.length; ) {
        text = text.replace(incorrect[i], incorrect[i + 1]);
        changed.push({
          new: incorrect[i + 1],
          old: incorrect[i],
          process: "grammar",
        });
        i += 2;
      }
    }
  }

  res.status(200).json({
    result: text,
    changed: changed,
  });
});
