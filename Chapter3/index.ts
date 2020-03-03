const fs = require("fs");
let freqCount = [];
let stopWords: string[] = fs.readFileSync("stop_words.txt", "utf8").split(","); //stop words in data[0]

//open input file and read from it
const lineReader = require("line-reader");
lineReader.eachLine("input_words.txt", function(line: string, last: boolean) {
  console.log(line);

  if (line[line.length - 1] != "\n") {
    //without it won't know it reached the en of the line
    line = line + "\n";
  }
  let startIndex: number = null,
    endIndex: number = 0;
  for (endIndex = 0; endIndex < line.length; endIndex++) {
    if (line[endIndex].match(/^([a-zA-Z0-9])$/)) {
      if (startIndex === null) {
        //still didn't find the start of the word
        startIndex = endIndex;
      }
    }
    //end of the word
    else {
      let found: boolean = false;
      let word: string = line.slice(startIndex, endIndex).toLowerCase(); //word itself
      if (word.length >= 2 && stopWords.indexOf(word.trim()) == -1) {
        //if the word is not from stop-words
        let index = 0;
        for (let i = 0; i < freqCount.length; i++) {
          if (word.trim() === freqCount[i][0].trim()) {
            freqCount[i][1]++;
            found = true;
            break;
          }
          index++;
        }
        //word does not exist in the array
        if (!found) {
          freqCount.push([word, 1]);
        } else if (freqCount.length > 1) {
          for (let i = index - 1; i >= 0; i--) {
            if (freqCount[index][1] > freqCount[i][1]) {
              let temp = freqCount[i];
              freqCount[i] = freqCount[index];
              freqCount[index] = temp;
              index = i;
            }
          }
        }
      }
      startIndex = null;
    }
  }

  if (last) {
    console.log(freqCount);
  }
});
