const fs = require("fs");
const extractWords = (filePath: string): string[] => {
  if (typeof filePath !== "string")
    throw new Error("Path of the file should be string");
  if (!filePath) throw new Error("The path should be a non empty string");
  let data: string;
  data = fs.readFileSync(filePath, "utf8");
  return data
    .replace(/[^a-zA-Z]/g, " ")
    .toLocaleLowerCase()
    .split(" ");
};
const removeStopWords = (data: string[]): string[] => {
  let stopWords: string[];
  if (!Array.isArray(data)) throw new Error("Data should be an array");
  stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  return data.filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
};
const calculateFreq = (data: string[]): Record<string, number> => {
  let freqCount: Record<string, number> = {};
  if (!Array.isArray(data)) throw new Error("Data should be an array");
  data.forEach(word => {
    if (freqCount[word]) {
      freqCount[word]++;
    } else {
      freqCount[word] = 1;
    }
  });
  return freqCount;
};
function sortArray(data: Record<string, number>): [string, number][] {
  if (data === null || typeof data !== "object" || Array.isArray(data))
    throw new Error("Data should be an {}");
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}
const compose = (...fns) => fns.reduce((f, g) => args => f(g(args)));
module.exports = [
  compose,
  extractWords,
  removeStopWords,
  calculateFreq,
  sortArray
];
