const fs = require("fs");
class Things{
    info(){
        console.log(this.constructor.name)
    }
}
class DataStorageManager extends Things{
  data: string;
  constructor(path: string) {
    super()
    this.data = fs
      .readFileSync(path, "utf8")
      .replace(/[^a-zA-Z]/g, " ")
      .toLocaleLowerCase();
  }
  words() {
    return this.data.split(" ");
  }
  info(){
    console.log(this.constructor.name)
}
}
class StopWordsManager extends Things {
  stopWords: string[];
  constructor() {
    super()
    this.stopWords = fs.readFileSync("stop_words.txt", "utf8").split(",");
  }
  is_Not_stop_word(word: string):boolean {
    return (this.stopWords.indexOf(word) == -1 && word.length !=0);
  }
  info(){
    console.log(this.constructor.name)
}
}
class WordFrequencyManager extends Things{
  private freqCount: Record<string, number>;
  constructor() {
    super();
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
    let freq=this.freqCount;//can't use this. in map() correctly
    let items = Object.keys(freq).map(function(key:string) {
      return [key, freq[key]];
    });
    return items.sort(function(first:any[], second:any[]) {
      return second[1] - first[1];
    });
  }
  info(){
    console.log(this.constructor.name)
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
