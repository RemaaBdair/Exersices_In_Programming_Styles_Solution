const fs = require("fs");
function readFile(filePath: string): string[] {
  return fs.readFileSync(filePath, "utf8").split("\n");
} //returns array of lines
function filterData(data: string[]): string[] {
  let filteredData: string = "";
  for (let line of data) {
    for (let i = 0; i < line.length; i++)
      if (line[i].match(/^([a-zA-Z0-9])$/)) {
        filteredData += line[i].toLocaleLowerCase();
      } else filteredData += " ";
  }
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  return filteredData.split(" ").filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
} //filter those chars in each line then split all words by ' ' then remove stop words from it
function calculateFreq(data: string[]): any[] {
  let found: boolean;
  let freqCount: any[] = [];
  for (let d of data) {
    found = false;
    for (let w of freqCount)
      if (d == w[0]) {
        w[1]++;
        found = true;
        break;
      }
    //word does not exist in the array
    if (!found) {
      freqCount.push([d, 1]);
    }
  }
  return freqCount;
}
function sortArray(data: any[]) {
  data.sort((a, b) => {
    return Number(b[1]) - Number(a[1]);
  });
  for (let i = 0; i < 25; i++) console.log(data[i]);
}
sortArray(calculateFreq(filterData(readFile("input_words.txt"))));
