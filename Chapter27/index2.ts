const fs = require("fs");
function* lines(filePath: string): IterableIterator<string> {
  let data: string[] = fs.readFileSync(filePath, "utf8").split("\n");
  for (let line of data)
    yield line.replace(/[^a-zA-Z]/g, " ").toLocaleLowerCase();
}
function* words(path: string): IterableIterator<string> {
  let startChar: boolean = false;
  let words: string[];
  for (let line of lines(path)) {
    words = line.split(" ");
    for (let w of words) yield w;
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
function* count(path: string): Generator<[string, number][]> {
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
