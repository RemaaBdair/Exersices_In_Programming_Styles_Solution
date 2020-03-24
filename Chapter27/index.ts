const fs = require("fs");
function* chars(filePath: string): IterableIterator<string> {
  let data: string = fs.readFileSync(filePath, "utf8");
  for (let c of data) yield c.toLocaleLowerCase();
}
function* words(path: string): IterableIterator<string> {
  let startChar: boolean = false;
  let word: string = "";
  for (let c of chars(path)) {
    if (!startChar) {
      if (c.match(/^([a-zA-Z0-9])$/)) {
        startChar = true;
        word = c;
      }
    } else {
      if (c.match(/^([a-zA-Z0-9])$/)) {
        word += c;
      } else {
        startChar = false;
        yield word;
      }
    }
  }
}
function* nonStopWords(path: string): IterableIterator<string> {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  for (let w of words(path)) {
    if (stopWords.indexOf(w) === -1 && w.length != 0) {
      yield w;
    }
  }
}
function* count(path: string) :Generator<[string,number][]>{
  let freqCount: Record<string, number> = {};
  for (let w of nonStopWords(path)) {
    if (freqCount[w]) {
      freqCount[w]++;
    } else {
      freqCount[w] = 1;
    }
  }
  yield Object.entries(freqCount).sort((a, b) => b[1] - a[1]);
}
let result = count("input_words.txt");
console.log(result.next().value);
