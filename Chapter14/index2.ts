const fs = require("fs");
class WordFrequencyFrameWork {
  loadEventHandler: { (path: string): void }[] = [];
  WorkingEventHanler: { (): void }[] = [];
  EndEventHandler: { (): void }[] = [];

  registerForLoadEvent(handler: (path: string) => void) {
    this.loadEventHandler.push(handler);
  }
  registerForWorkingEvent(handler: () => void) {
    this.WorkingEventHanler.push(handler);
  }
  registerForEndEvent(handler: () => void) {
    this.EndEventHandler.push(handler);
  }
  run(path: string) {
    for (let e of this.loadEventHandler) {
      e(path);
    }
    for (let e of this.WorkingEventHanler) {
      e();
    }
    for (let e of this.EndEventHandler) {
      e();
    }
  }
}
class DataStorage {
  data: string;
  wordEventHandler = [];
  stopWordsFilter: StopWordFilter;
  constructor(
    stopWordsFilter: StopWordFilter,
    frameWork: WordFrequencyFrameWork
  ) {
    this.stopWordsFilter = stopWordsFilter;
    frameWork.registerForLoadEvent(this.load.bind(this));
    frameWork.registerForWorkingEvent(this.word.bind(this));
  }
  load(path: string) {
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
  }
  word() {
    this.data.split(" ").forEach(w => {
      if (this.stopWordsFilter.is_Not_stop_word(w))
        for (let h of this.wordEventHandler) h(w);
    });
  }
  registerForWordEvent(handler: (word: string) => void) {
    this.wordEventHandler.push(handler);
  }
}
class StopWordFilter {
  stopWords: string[] = [];
  constructor(frameWork: WordFrequencyFrameWork) {
    frameWork.registerForLoadEvent(this.load.bind(this));
  }
  load() {
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  }
  is_Not_stop_word(word: string): boolean {
    return this.stopWords.indexOf(word) == -1 && word.length != 0;
  }
}
class WordFrequencyCounter {
  freqCount: Record<string, number> = {};
  constructor(dataStorage: DataStorage, frameWork: WordFrequencyFrameWork) {
    dataStorage.registerForWordEvent(this.incrementFrequency.bind(this));
    frameWork.registerForEndEvent(this.print.bind(this));
  }
  incrementFrequency(word: string) {
    if (this.freqCount[word]) {
      this.freqCount[word]++;
    } else {
      this.freqCount[word] = 1;
    }
  }
  print() {
    let sortedWords = Object.entries(this.freqCount).sort(
      (a, b) => b[1] - a[1]
    );
    for (let w of sortedWords) console.log(w);
  }
}
class NonStopWordsWithZ {
  counter: number = 0;
  constructor(frameWork: WordFrequencyFrameWork, dataStorage: DataStorage) {
    data_storage.registerForWordEvent(this.count.bind(this));
    frameWork.registerForEndEvent(this.print.bind(this));
  }
  count(word: string) {
    if (word.includes("z")) this.counter++;
  }
  print() {
    console.log("The count of non-stop words with z=", this.counter);
  }
}
let wfapp = new WordFrequencyFrameWork();
let stop_word_filter = new StopWordFilter(wfapp);
let data_storage = new DataStorage(stop_word_filter, wfapp);
let word_freq_counter = new WordFrequencyCounter(data_storage, wfapp);
let nonStopWordsWithZ = new NonStopWordsWithZ(wfapp, data_storage);
wfapp.run("input_words.txt");
