const axios = require("axios");
var fs = require("fs");

let dictionary = require("./dictionary.json");

let existingWords = [];

for (a in dictionary) {
  existingWords.push(dictionary[a].word);
}

const OLLAMA_API_URL = "http://localhost:1111";

async function llama3(prompt) {
  try {
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
      model: "llama3.1",
      prompt: prompt,
      stream: false,
    });
    return response.data.response;
  } catch (error) {
    console.error("Error communicating with Ollama:", error.message);
    return null;
  }
}

//ollama prompt
async function generateWords() {
  console.log("Generating word");
  let word = await llama3(
    `Generate a random word that is considered overly fancy, posh, or sophisticated. Ensure that the word itself is uncommon, obscure, and difficult for an average person to understand but the synonym of it is common. Thus a fancy word for something really basic. Return only the word, without any capitalization, and without any additional text or explanation.`
  );
  console.log("Got word: " + word);
  if (existingWords.includes(word)) {
    console.log("Word already exists, trying again");
    console.log("----------------------------------------");
    generateWords();
    return;
  }
  existingWords.push(word);
  console.log("Awaiting synonyms");
  let synonyms = await llama3(
    `Give me as many synonyms as possible for the following word: ${word} Respond in this syntax: synonym, synonym, synonym. Use a comma after every synonym, except the last one. Do not capitalize any of the synonyms. Do not respond with anyhting else. Do not use quotes or punctuation in your response. If there is a problem, for example if you couldn't find any synonyms, respond with just null. Do not respond with anything else under any circumstances.`
  );
  if (synonyms == "null") {
    console.log("No synonyms found, trying again");
    console.log("----------------------------------------");
    generateWords();
    return;
  }
  console.log(synonyms);
  synonyms = synonyms.split(", ");
  console.log("Got synonyms: " + synonyms);
  let nonCapitalized = { word: word, synonyms: synonyms };
  nonCapitalized.word =
    nonCapitalized.word.charAt(0).toLowerCase() + nonCapitalized.word.slice(1);
  for (synonym in nonCapitalized.synonyms) {
    nonCapitalized.synonyms[synonym] =
      nonCapitalized.synonyms[synonym].charAt(0).toLowerCase() +
      nonCapitalized.synonyms[synonym].slice(1);
  }
  dictionary.push(nonCapitalized);
  let capitalized = JSON.parse(JSON.stringify(nonCapitalized));
  capitalized.word =
    capitalized.word.charAt(0).toUpperCase() + capitalized.word.slice(1);
  for (synonym in capitalized.synonyms) {
    capitalized.synonyms[synonym] =
      capitalized.synonyms[synonym].charAt(0).toUpperCase() +
      capitalized.synonyms[synonym].slice(1);
  }
  dictionary.push(capitalized);
  fs.writeFile(
    "./dictionary.json",
    JSON.stringify(dictionary),
    "utf8",
    function (err) {
      if (err) throw err;
      console.log("complete");
      console.log("----------------------------------------");
    }
  );
  generateWords();
}

generateWords();
