const b = require('./index.js');

let bow = new b.BagOfWords();

let tokens = bow.tokenize("del salón en el ángulo oscuro", "es");

console.log(tokens);

let enTokens = bow.tokenize("In the middle of the street there is a tree. Yes there is.", "en");

console.log(enTokens);