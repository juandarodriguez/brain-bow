const lorca = require('lml-lorca-nlp');
const sw = require('stopword');
const englishTokenizer = require('./tokenizer');

const s_words = [
    'a', 'un', 'el', 'ella', 'y', 'sobre', 'de', 'la', 'que', 'en',
    'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con',
    'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le',
    'ya', 'o', 'porque', 'cuando', 'muy', 'sin', 'sobre', 'también',
    'me', 'hasta', 'donde', 'quien', 'desde', 'nos', 'durante', 'uno',
    'ni', 'contra', 'ese', 'eso', 'mí', 'qué', 'otro', 'él', 'cual',
    'poco', 'mi', 'tú', 'te', 'ti', 'sí',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_'
];

module.exports.BagOfWords = function() {

    this.spanishTokenize = function(text) {
        let doc = lorca(text);
        let stemWords = doc.words().stem().get();
        let stemStopWords = sw.removeStopwords(stemWords, s_words);

        return stemStopWords;
    }

    this.englishTokenize = function(text) {
        let tokens = englishTokenizer(text)
        return (tokens);
    }

    this.tokenize = function(text, lang) {
        if (lang == 'es') {
            return this.spanishTokenize(text);
        } else if (lang == 'en') {
            return this.englishTokenize(text);
        }

    }

    this.extractDictionary = function(textArray, lang) {
        var dict = {},
            keys = [],
            words;
        textArray = Array.isArray(textArray) ? textArray : [textArray];
        textArray.forEach((text) => {
            words = this.tokenize(text, lang);
            words.forEach((word) => {
                word = word.toLowerCase();
                if (!dict[word] && word !== '') {
                    dict[word] = 1;
                    keys.push(word);
                } else {
                    dict[word] += 1;
                }
            });
        });

        return {
            words: keys,
            dict: dict
        };
    }

    this.bow = function(text, vocabulary) {
        var dict = this.extractDictionary([text]).dict,
            vector = [];

        vocabulary.words.forEach((word) => {
            vector.push(dict[word] || 0);
        });
        return vector;
    }

    this.tf = function(word, text) {
        var input = word.toLowerCase();
        var dict = this.extractDictionary(text).dict;
        return dict[input] / this.tokenize(text).length;
    }

    this.wordInDocsCount = function(word, textlist) {
        var sum = 0;
        textlist.forEach((text) => {
            sum += this.tokenize(text).indexOf(word) > -1 ? 1 : 0;
        });
        return sum;
    }

    this.idf = function(word, textlist) {
        return Math.log(textlist.length / (1 + this.wordInDocsCount(word, textlist)));
    }

    this.tfidf = function(word, text, textlist) {
        return this.tf(word, text) * this.idf(word, textlist);
    }

    this.vec_result = function(res, num_classes) {
        let vec = [];
        for (let i = 0; i < num_classes; i += 1) {
            vec.push(0);
        }
        vec[res] = 1;
        return vec;
    }

    this.maxarg = function(array) {
        let a = [];
        if (!Array.isArray(array)) {
            for (let i in array) {
                a.push(array[i])
            }
        }
        array = Array.isArray(array) ? array : a;

        return array.indexOf(Math.max.apply(Math, array));
    }
}