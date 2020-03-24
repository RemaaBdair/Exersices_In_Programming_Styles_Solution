const fs = require("fs");
const { Queue } = require("queue-typescript");
let wordSpace = new Queue();
let freqSpace = new Queue();
let stopWords: string[] = fs.readFileSync("stop_words.txt", "utf8").split(",");
let threads:Promise<string>[] = [];
let freqCount: Record<string, number> = {};

function processWord(id: number, resolve: Function) {
  let internalFreqCount: Record<string, number> = {};
  let time = setInterval(() => {
    if (wordSpace.length !== 0) {
      let word: string = wordSpace.dequeue();
      console.log(`current Thread is: ${id}, current Word is:${word}`);
      if (stopWords.indexOf(word) === -1 && word.length !== 0) {
        if (!internalFreqCount[word]) internalFreqCount[word] = 1;
        else internalFreqCount[word] += 1;
      }
    } else {
      freqSpace.enqueue(internalFreqCount);
      resolve("finished successfully");
      clearInterval(time);
    }
  }, 0);
}
function merge(id: number, resolve: Function) {
  let internalFreq: Record<string, number>;
  let time = setInterval(() => {
    if (freqSpace.length !== 0) {
      internalFreq = freqSpace.dequeue();
      console.log(`current Thread is: ${id}, current Word is:${Object.entries(internalFreq)}`);
      for (let keys of Object.keys(internalFreq)) {
        if (!freqCount[keys]) freqCount[keys] = internalFreq[keys];
        else freqCount[keys] = freqCount[keys] + internalFreq[keys];
      }
    } else {
      resolve('done');
      clearInterval(time);
    }
  }, 0);
}
async function mainFunction() {
  let data: string[] = fs
    .readFileSync("input_words.txt", "utf8")
    .replace(/[\W_]+/g, " ")
    .toLocaleLowerCase()
    .split(" ");
  for (let word of data) wordSpace.enqueue(word);
  //creating threads to process words
  for (let i = 0; i < 5; i++) {
    threads.push(
      new Promise(function(resolve, reject) {
        processWord(i, resolve);
      })
    );
  }
  await Promise.all(threads);
  //creating threds to merge dictionary
  threads = [];
  for (let i = 0; i < 5; i++) {
    threads.push(
      new Promise(function(resolve, reject) {
        merge(i, resolve);
      })
    );
  }
  await Promise.all(threads);

  //sort the dictionary
  let sortedArray: [string, number][] = Object.entries(freqCount).sort(
    (a, b) => b[1] - a[1]
  );
  console.log(sortedArray);
}

mainFunction();
