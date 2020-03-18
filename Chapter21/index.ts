const fs = require("fs");
const assert = require("assert");
function extractWords(filePath: string): string[] {
  assert(typeof filePath === "string", "Path of the file should be string");
  assert(filePath, "The path should be a non empty string");
  let data: string;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error(e);
  }
  return data
    .replace(/[^a-zA-Z]/g, " ")
    .toLocaleLowerCase()
    .split(" ");
}
function removeStopWords(data: string[]): string[] {
  let stopWords: string[];
  assert(data.constructor === Array, "Data should be an array");
  try {
    stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  } catch (e) {
    console.error(e);
  }
  return data.filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
}
function calculateFreq(data: string[]): Record<string, number> {
  let freqCount: Record<string, number> = {};
  assert(data.constructor === Array, "Data should be an array");
  assert(data.length !== 0, "Data should'nt be an empty array");
  data.forEach(word => {
    if (freqCount[word]) {
      freqCount[word]++;
    } else {
      freqCount[word] = 1;
    }
  });
  return freqCount;
}
function sortArray(data: Record<string, number>):[string,number][] {
  assert(typeof data === "object", "Data should be an {}");
  assert(data.length !== 0, "Data shouldn't be an empty Record");
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}
const compose = (...fns) => fns.reduce((f, g) => args => f(g(args)));
const freqCount = compose(
  sortArray,
  calculateFreq,
  removeStopWords,
  extractWords
)("input_words.txt");
assert(freqCount.constructor === Array, "freqCount ahould return an array");
for (let i = 0; i < 25; i++) console.log(freqCount[i]);
