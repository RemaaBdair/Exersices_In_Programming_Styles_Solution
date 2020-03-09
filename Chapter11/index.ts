const fs = require("fs");
class DataStorageManager {
  data: string;
  dispatch(message: string, path?: string) {
    switch (message) {
      case "init":
        this.init(path);
        break;
      case "words":
        return this.words();
      default:
        throw new Error("Can't understand the mesage");
    }
  }
  init(path: string) {
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
  }
  words(): string[] {
    return this.data.split(" ");
  }
}
class StopWordsManager {
  stopWords: string[];
  dispatch(message: string, word?: string) {
    switch (message) {
      case "init":
        this.init();
        break;
      case "stopWords":
        return this.is_Not_stop_word(word);
      default:
        throw new Error("Can't understand the mesage");
    }
  }
  init() {
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  }
  is_Not_stop_word(word: string): boolean {
    return this.stopWords.indexOf(word) == -1 && word.length != 0;
  }
}
class WordFrequencyManager {
  freqCount: Record<string, number>;
  dispatch(message: string, word?: string) {
    switch (message) {
      case "init":
        this.init();
        break;
      case "increment":
        this.increment_count(word);
        break;
      case "sort":
        return this.sort();
      default:
        throw new Error("Can't understand the mesage");
    }
  }
  init() {
    this.freqCount = {};
  }
  increment_count(word: string) {
    if (this.freqCount[word]) {
      this.freqCount[word]++;
    } else {
      this.freqCount[word] = 1;
    }
  }
  sort() {
    return Object.entries(this.freqCount).sort((a, b) => b[1] - a[1]);
  }
}
class WordFrequencyController {
  wordFrequencyManager: WordFrequencyManager;
  stopWordsManager: StopWordsManager;
  dataStorageManager: DataStorageManager;
  dispatch(message: string, path?: string) {
    switch (message) {
      case "init":
        this.init(path);
        break;
      case "run":
        this.run();
        break;
      default:
        throw new Error("Can't understand the mesage");
    }
  }
  init(path: string) {
    this.dataStorageManager = new DataStorageManager();
    this.stopWordsManager = new StopWordsManager();
    this.wordFrequencyManager = new WordFrequencyManager();
    this.dataStorageManager.dispatch("init", path);
    this.stopWordsManager.dispatch("init");
    this.wordFrequencyManager.dispatch("init");
  }
  run() {
    this.dataStorageManager.words().forEach(word => {
      if (this.stopWordsManager.dispatch("stopWords", word))
        this.wordFrequencyManager.dispatch("increment", word);
    });
    console.log(this.wordFrequencyManager.sort());
  }
}
let wordFrequencyController = new WordFrequencyController();
wordFrequencyController.dispatch("init", "input_words.txt");
wordFrequencyController.dispatch("run");
