const fs = require("fs");
function extractWords(filePath: string): string[] {
  if (typeof filePath !== "string" || !filePath) return [];
  let data: string;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error(e);
    return [];
  }
  return data
    .replace(/[^a-zA-Z]/g, " ")
    .toLocaleLowerCase()
    .split(" ");
}
function removeStopWords(data: string[]): string[] {
  let stopWords: string[];
  if (data.constructor !== Array || data.length===0) return [];
  try {
    stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  } catch (e) {
    console.error(e);
    return [];
  }
  return data.filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
}
function calculateFreq(data: string[]): Record<string, number> {
  let freqCount: Record<string, number> = {};
  if (data.length === 0 || data.constructor !== Array) return {};
  data.forEach(word => {
    if (freqCount[word]) {
      freqCount[word]++;
    } else {
      freqCount[word] = 1;
    }
  });
  return freqCount;
}
function sortArray(data: Record<string, number>) {
  if (data.length === 0 || typeof data !== "object") return [];
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}
const compose = (...fns) => fns.reduce((f, g) => args => f(g(args)));
const freqCount = compose(
  sortArray,
  calculateFreq,
  removeStopWords,
  extractWords
)("input_words.txt");
for (let i = 0; i < 25; i++) console.log(freqCount[i]);
