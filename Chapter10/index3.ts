const fs = require("fs");
class DataStorageManager {
  data: string;
  stopWords: string[];
  constructor(path: string) {
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  }
  words():string[]{
    return this.data.split(" ");
  }
  is_Not_stop_word(word: string): boolean {
    return this.stopWords.indexOf(word) == -1 && word.length != 0;
  }
}
class FrequencyManager {
  freqCount: Record<string, number>;
  constructor() {
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
    let freq = this.freqCount; //can't use this. in map() correctly
    let items = Object.keys(freq).map(function(key: string) {
      return [key, freq[key]];
    });
    return items.sort(function(first: any[], second: any[]) {
      return second[1] - first[1];
    });
  }
}
class WordFrequencyController {
  dataStorageManager: DataStorageManager;
  frequencyManager: FrequencyManager;
  constructor(path: string) {
    this.dataStorageManager = new DataStorageManager(path);
    this.frequencyManager = new FrequencyManager();
  }
  run() {
    this.dataStorageManager.words().forEach(word => {
      if (this.dataStorageManager.is_Not_stop_word(word))
        this.frequencyManager.increment_count(word);
    });
    console.log(this.frequencyManager.sort());
  }
}
new WordFrequencyController("input_words.txt").run();
