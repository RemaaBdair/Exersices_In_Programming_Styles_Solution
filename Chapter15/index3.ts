const fs = require("fs");
class EventManager {
  subscriptionsList: {};
  constructor() {
    this.subscriptionsList = {};
  }
  subscribe(eventName: string, handler) {
    if (!this.subscriptionsList[eventName])
      this.subscriptionsList[eventName] = [handler];
    else this.subscriptionsList[eventName].push(handler);
  }
  publish(eventName: string, arg, flag?: boolean) {
    if (this.subscriptionsList[eventName]) {
      for (let handler of this.subscriptionsList[eventName]) handler(arg, flag);
    }
  }
  unsubscribe(eventName: string, handler) {
    if (this.subscriptionsList[eventName])
      this.subscriptionsList[eventName].filter(h => handler !== h);
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
    this.eventManager.unsubscribe("loadFile", this.load);
    console.log("DataStorag unsubscribed from loadFile");
  };
  wordsGenerator = () => {
    this.data
      .split(" ")
      .forEach(w => this.eventManager.publish("generatedWords", w, false));
    this.eventManager.publish("generatedWords", null, true);
    this.eventManager.unsubscribe("beginWork", this.load);
    this.eventManager.publish("end", null);
    console.log("DataStorag unsubscribed from beginWork");
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
    this.eventManager.unsubscribe("loadFile", this.load);
    console.log("StopWordFilter unsubscribed from loadFile");
  };
  isNotAStopWord = (word: string, unsubscribe?: boolean) => {
    if (unsubscribe == true) {
      this.eventManager.publish("notAstopWord", word, true);
      this.eventManager.unsubscribe("generatedWords", this.isNotAStopWord);
      console.log("StopWordFilter unsubscribed from generatedWords");
    } else if (this.stopWords.indexOf(word) == -1 && word.length != 0)
      this.eventManager.publish("notAstopWord", word, false);
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
  incrementFrequency = (word: string, unsubscribe?: boolean) => {
    if (unsubscribe == true) {
      this.eventManager.unsubscribe("notAstopWord", this.incrementFrequency);
      console.log("WordFrequencyCounter unsubscribed from incrementFrequency");
    } else if (this.freqCount[word]) {
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
    this.eventManager.unsubscribe("print", this.print);
    console.log("WordFrequencyCounter unsubscribed from print");
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
    this.eventManager.unsubscribe("start", this.start);
    console.log("WordFrequencyApp unsubscribed from start");
  };
  end = () => {
    this.eventManager.publish("print", null);
    this.eventManager.unsubscribe("end", this.end);
    console.log("WordFrequencyApp unsubscribed from end");
  };
}

let eventManager = new EventManager();
let dataStorage = new DataStorage(eventManager);
let stopWordFilter = new StopWordFilter(eventManager);
let wordFrequencyCounter = new WordFrequencyCounter(eventManager);
let wordFrequencyApp = new WordFrequencyApp(eventManager);
eventManager.publish("start", "input_Words.txt");
