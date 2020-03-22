const fs = require("fs");
class EventManager {
  subscriptionsList: Record<string,((arg: string) => void)[]>;
  constructor() {
    this.subscriptionsList = {};
  }
  subscribe(eventName: string, handler:((arg: string) => void)) {
    if (!this.subscriptionsList[eventName])
      this.subscriptionsList[eventName] = [handler];
    else this.subscriptionsList[eventName].push(handler);
  }
  publish(eventName: string, arg:string) {
    if (this.subscriptionsList[eventName]) {
      for (let handler of this.subscriptionsList[eventName]) handler(arg);
    }
  }
}

class DataStorage {
  data: string;
  eventManager: EventManager;
  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    eventManager.subscribe("loadFile", this.load);
    eventManager.subscribe("beginWork", this.wordsGenerator);
  }
  load = (path: string) => {
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
  };
  wordsGenerator = () => {
    this.data
      .split(" ")
      .forEach(w => this.eventManager.publish("generatedWords", w));
    this.eventManager.publish("end", null);
  };
}
class StopWordFilter {
  stopWords: string[];
  eventManager: EventManager;
  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.stopWords = [];
    this.eventManager.subscribe("loadFile", this.load);
    this.eventManager.subscribe("generatedWords", this.isNotAStopWord);
  }
  load = () => {
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  };
  isNotAStopWord = (word: string) => {
    if (this.stopWords.indexOf(word) == -1 && word.length != 0)
      this.eventManager.publish("notAstopWord", word);
  };
}
class WordFrequencyCounter {
  freqCount: Record<string, number>;
  eventManager: EventManager;
  constructor(eventManager: EventManager) {
    this.freqCount = {};
    this.eventManager = eventManager;
    this.eventManager.subscribe("notAstopWord", this.incrementFrequency);
    this.eventManager.subscribe("print", this.print);
  }
  incrementFrequency = (word: string) => {
    if (this.freqCount[word]) {
      this.freqCount[word]++;
    } else {
      this.freqCount[word] = 1;
    }
  };
  print = () => {
    let sortedWords = Object.entries(this.freqCount).sort(
      (a, b) => b[1] - a[1]
    );
    for (let w of sortedWords) console.log(w);
  };
}
class WordFrequencyApp {
  eventManager: EventManager;
  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.eventManager.subscribe("start", this.start);
    this.eventManager.subscribe("end", this.end);
  }
  start = path => {
    this.eventManager.publish("loadFile", path);
    this.eventManager.publish("beginWork", null);
  };
  end = () => {
    this.eventManager.publish("print", null);
  };
}

let eventManager = new EventManager();
let dataStorage = new DataStorage(eventManager);
let stopWordFilter = new StopWordFilter(eventManager);
let wordFrequencyCounter = new WordFrequencyCounter(eventManager);
let wordFrequencyApp = new WordFrequencyApp(eventManager);
eventManager.publish("start", "input_Words.txt");
