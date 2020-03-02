const fs = require("fs");
let data = [];
data[10] = [];
data[0] = fs.readFileSync("stop_words.txt", "utf8").split(","); //stop words in data[0]

/*//open new file
let input = fs.open("word_freqs.txt", "w", (err: Error) => {
  if (err) {
    throw err;
  }
});
*/
//open input file and read from it
const lineReader = require("line-reader");
lineReader.eachLine("input_words.txt", function(line: string, last: boolean) {
  console.log(line);
  data[1] = line;
  if (data[1][data[1].length - 1] != "\n") {
    //without it won't know it reached the en of the line
    data[1] = data[1] + "\n";
  }
  data[2] = null; //start index of the word
  data[3] = 0; //ending index
  for (data[3] = 0; data[3] < data[1].length; data[3]++) {
    if (data[1][data[3]].match(/^([a-zA-Z0-9])$/)) {
      if (data[2] === null) {
        //still didn't find the start of the word
        data[2] = data[3];
      }
    }
    //end of the word
    else {
      data[4] = data[1].slice(data[2], data[3]).toLowerCase(); //word itself
      if (data[4].length >= 2 && data[0].indexOf(data[4].trim()) == -1) {
        //if the word is not from stop-words
        data[5] = data[10]; //array of word-freq
        if (data[10].length === 0) {
          data[10].push(`${data[4]} ,1`);
        } else {
          for (data[8] = 0; data[8] < data[5].length; data[8]++) {
            data[7] = Number(data[5][data[8]].split(",")[1]); //freq
            data[6] = data[5][data[8]].split(",")[0].trim(); //word
            if (data[4].trim() === data[6].trim()) {
              data[7]++;
              data[10][data[8]] = `${data[4]} ,${data[7].toString()}`;
              break;
            }

            //word does not exist in the array
            if (data[8] === data[5].length - 1) {
              data[10][++data[8]] = `${data[4]} ,1`;
            }
          }
        }
      }
      data[2] = null;
    }
  }

  if (last) {
    for (data[8] = 0; data[8] < data[10].length; data[8]++) {
      console.log("File is created!");
      fs.appendFile("word_freqs.txt", `${data[10][data[8]]} \n`, function(
        err: Error
      ) {
        if (err) {
          throw err;
        }
      });
    }

    //part2
    data[10].sort((a: string, b: string) => {
      return Number(b.split(",")[1]) - Number(a.split(",")[1]);
    });
    console.log(data[10]);
  }
});
