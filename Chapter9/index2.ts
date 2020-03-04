const fs = require("fs");
const wrap =(v)=> v;

const bind =(v, func)=> func(v);

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
function filter(data: string): string {
  return data.replace(/[^a-zA-Z]/g, " ").toLocaleLowerCase();
}
function splitWords(data: string): string[] {
  return data.split(" ");
}
function removeStopWords(data: string[]): string[] {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  return data.filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
}
function calculateFreq(data: string[]): any[] {
  let found: boolean;
  let freqCount: any[] = [];

  data.map(word => {
    found = false;
    freqCount.map(w => {
      if (word === w[0]) {
        w[1]++;
        found = true;
      }
    });
    if (!found) freqCount.push([word, 1]);
  });
  return freqCount;
}
function sortArray(data: any[]): any[] {
  return data.sort((a: any[], b: any[]) => {
    return Number(b[1]) - Number(a[1]);
  });
}

;
console.log(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap("input_words.txt"),readFile)),filter)),splitWords)),removeStopWords)),calculateFreq)),sortArray)))


