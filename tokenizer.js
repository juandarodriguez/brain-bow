module.exports = function(str) {
    var words = str.replace(/[^a-zA-Z0-9\u00C0-\u00FF]+/g, ' ').split(' ');

    let stem = require('./en.js');

    for (var i = 0, l = words.length; i < l; i++) { words[i] = stem(words[i]); }

    function removeDups(names) {
        let unique = {};
        names.forEach(function(i) {
            if (!unique[i] && i != '') {
                unique[i] = true;
            }
        });
        return Object.keys(unique);
    }

    return removeDups(words);
}