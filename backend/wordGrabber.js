let dictionary = require("./dictionary.json");

let existingWords = [];

for (a in dictionary) {
  existingWords.push(dictionary[a].word);
}

//ollama prompt
const userAction = async () => {
  let response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: {
      model: "llama3:70b",
      prompt:
        "Give me words seen as fancy, posh, or sophisticated. A normal person should not have heared that word before. Just return the word, not anything else.",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json().response;
  if (existingWords.includes(result)) {
    userAction();
  }
  existingWords.push(result);
  response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: {
      model: "llama3:70b",
      prompt:
        "Give me as many synonyms as possible for the following word, respond in a syntax of ['synonym', 'synonym', 'synonym']: " +
        result,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const synonyms = await response.json().response;
};

//check if word is in dictionary
//if so, ask ollama for list of synonyms, add them to dictionary, push capizalized/adverb version
//if not, ask for other word,
