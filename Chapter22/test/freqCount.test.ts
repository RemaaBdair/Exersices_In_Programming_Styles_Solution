const [compos,extract,removeSW,calcFreq,sort]= require('../index2.ts');
const fss = require("fs");

describe("extract", () => {
    test("when no string is passed", () => {
      expect(()=>extract(['hi'])).toThrow(new Error("Path of the file should be string"))
})
})
describe("removeSW", () => {
  test("when a string is passed instead of an array", () => {
    expect(()=>removeSW("")).toThrowError(new Error("Data should be an array"))
})
})
describe("calcFreq", () => {
  test("when a string is passed instead of an array", () => {
    expect(()=>calcFreq("")).toThrowError(new Error("Data should be an array"))
})
})
describe("sort", () => {
  test("when no argument is passed", () => {
    expect(()=>sort()).toThrowError(new Error("Data should be an {}"))
})
})
describe("Main tion", () => {
  test("when pass incorrect file name", () => {
    try{
    let freqCount= compose(
      sortArray,calculateFreq,removeStopWords,extractWords
    )('input_words.tc')
    expect(freqCount).toThrow()
    }
    catch(e){
      console.error(e)
    }
})
})