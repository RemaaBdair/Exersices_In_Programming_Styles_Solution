const fs = require("fs");
const wrap = v => () => v;

const bind = (v, func) => func(v());
const fBind = (v, func) => wrap(bind(v, func));

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
function filter(data: string): string {
  return data.replace(/[^a-zA-Z]/g, " ").toLocaleLowerCase();
}
function splitWords(data: string): string[] {
  return data.split(" ");
}
function removeStopWords(data: string[]): string[] {
  let stopWords: string[] = fs
    .readFileSync("stop_words.txt", "utf8")
    .split(",");
  return data.filter(word => {
    return stopWords.indexOf(word) == -1 && word.length != 0;
  });
}
function calculateFreq(data: string[]): Record<string, number> {
  let freqCount: Record<string, number> = {};
  data.forEach(word => {
    if (freqCount[word]) {
      freqCount[word]++;
    } else {
      freqCount[word] = 1;
    }
  });
  return freqCount;
}
function sortArray(data: {}): Record<string, number> {
  let items = Object.keys(data).map(function(key) {
    return [key, data[key]];
  });
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  let sorted_obj: Record<string, number> = {};
  items.forEach(w => {
    sorted_obj[w[0]] = w[1];
  });
  return sorted_obj;
}

console.log(
  wrap(
    bind(
      wrap(
        bind(
          wrap(
            bind(
              wrap(
                bind(
                  wrap(
                    bind(wrap(bind(wrap("input_words.txt"), readFile)), filter)
                  ),
                  splitWords
                )
              ),
              removeStopWords
            )
          ),
          calculateFreq
        )
      ),
      sortArray
    )
  )
);
