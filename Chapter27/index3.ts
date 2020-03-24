const fs = require("fs");
let freqCount: Record<string, number> = {};
function lines(filePath: string) :[string,number][]{
  let data: string[] = fs
    .readFileSync(filePath, "utf8")
    .replace(/[^a-zA-Z]/g, " ")
    .toLocaleLowerCase()
    .split("\n");
  let iterator = data[Symbol.iterator]();
  let x;
  while (!(x = iterator.next()).done) {
    words(x.value);
  }
   return sort(); //
}
function words(line: string) {
  let words: string[] = line.split(" ");
  let iterator = words[Symbol.iterator]();
  let x;
  while (!(x = iterator.next()).done) {
    nonStopWords(x.value);
  }
}
function nonStopWords(word: string) {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  if (stopWords.indexOf(word) === -1 && word.length != 0) {
    count(word);
  }
}
function count(word: string) {
  if (freqCount[word]) {
    freqCount[word]++;
  } else {
    freqCount[word] = 1;
  }
}
function sort(): [string, number][] {
  return Object.entries(freqCount).sort((a, b) => b[1] - a[1]);
}
let result = lines("input_words.txt");
console.log(result);
