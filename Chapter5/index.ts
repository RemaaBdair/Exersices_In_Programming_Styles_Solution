const fs = require("fs");
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
function filter(data: string): string {
  let filteredData: string = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i].match(/^([a-zA-Z0-9])$/)) {
      filteredData += data[i].toLocaleLowerCase();
    } else filteredData += " ";
  }
  return filteredData;
}
function splitWords(data: string): string[] {
  return data.split(" ");
}
function removeStopWords(data: string[]): string[] {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  let noStopWordsData: string[] = [];
  for (let i = 0; i < data.length; i++) {
    if (stopWords.indexOf(data[i]) == -1 && data[i].length != 0) {
      noStopWordsData.push(data[i]);
    }
  }
  return noStopWordsData;
}
function calculateFreq(data: string[]): any[] {
  let found: boolean;
  let freqCount: any[] = [];
  for (let r = 0; r < data.length; r++) {
    found = false;
    for (let i = 0; i < freqCount.length; i++)
      if (data[r] == freqCount[i][0]) {
        freqCount[i][1]++;
        found = true;
        break;
      }
    //word does not exist in the array
    if (!found) {
      freqCount.push([data[r], 1]);
    }
  }
  return freqCount;
}
function sortArray(data: any[]): any[] {
  for (let j = 0; j < data.length; j++)
    for (let i = j + 1; i < data.length; i++)
      if (data[j][1] < data[i][1]) {
        let temp = data[i];
        data[i] = data[j];
        data[j] = temp;
      }
  return data;
}
function print25(data: any[]) {
  for(let i=0;i<25;i++)
  console.log(data[i])
}

print25(
  sortArray(
    calculateFreq(
      removeStopWords(splitWords(filter(readFile("input_words.txt"))))
    )
  )
);
