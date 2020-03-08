const fs = require("fs");
const dataStorageManager = (path: string) => {
  let data = fs
    .readFileSync(path, "utf8")
    .replace(/[^a-zA-Z]/g, " ")
    .toLocaleLowerCase();
  return data.split(" ");
};
const stopWordsManager = (word: string) => {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  return stopWords.indexOf(word) == -1 && word.length != 0;
};
const wordFrequencyManager = {
  freqCount: {},
  calcFreq: function(word: string) {
    if (wordFrequencyManager.freqCount[word]) {
      wordFrequencyManager.freqCount[word]++;
    } else {
      wordFrequencyManager.freqCount[word] = 1;
    }
  },
  sort: function() {
    let items = Object.keys(wordFrequencyManager.freqCount).map(function(
      key: string
    ) {
      return [key, wordFrequencyManager.freqCount[key]];
    });
    return items.sort(function(first: any[], second: any[]) {
      return second[1] - first[1];
    });
  }
};

const run = () => {
  let wordFreq = [];
  dataStorageManager("input_words.txt").forEach(word => {
    if (stopWordsManager(word)) wordFrequencyManager.calcFreq(word);
  });
  console.log(wordFrequencyManager.sort());
};

run();
