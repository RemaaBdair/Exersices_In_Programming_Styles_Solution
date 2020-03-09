const fs = require("fs");
interface IDataStorageManager{
  words():string[];
}
interface IStopWordsManager{
    is_Not_stop_word(word:string):boolean;
}
interface IWordFrequencyManager{
    increment_count(word:string):void;
    sort():[string,number][]
}
class DataStorageManager implements IDataStorageManager{
  data: string;
  constructor(path: string) {
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
  }
  words() {
    return this.data.split(" ");
  }
}
class StopWordsManager implements IStopWordsManager{
  stopWords: string[];
  constructor() {
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  }
  is_Not_stop_word(word: string):boolean {
    return (this.stopWords.indexOf(word) == -1 && word.length !=0);
  }
}
class WordFrequencyManager implements IWordFrequencyManager{
  private freqCount: Record<string, number>;
  constructor() {
    this.freqCount = {};
  }
  increment_count(word:string) {
    if (this.freqCount[word]) {
      this.freqCount[word]++;
    } else {
      this.freqCount[word] = 1;
    }
  }
  sort() {
    return Object.entries(this.freqCount).sort((a, b) => b[1]-a[1]);
  }
}
class WordFrequencyController{
    wordFrequencyManager:WordFrequencyManager;
    stopWordsManager:StopWordsManager;
    dataStorageManager:DataStorageManager;
    constructor(path:string){
      this.dataStorageManager= new DataStorageManager(path);
      this.stopWordsManager= new StopWordsManager();
      this.wordFrequencyManager= new WordFrequencyManager();
    }
    run(){
        this.dataStorageManager.words().forEach(word=>{
            if(this.stopWordsManager.is_Not_stop_word(word))
            this.wordFrequencyManager.increment_count(word)
        });
       console.log(this.wordFrequencyManager.sort());
}
}
new WordFrequencyController("input_words.txt").run();
