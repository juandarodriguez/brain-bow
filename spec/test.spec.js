const {BagOfWords} = require('../index');

describe("Basic operations", function () {

    let bow = new BagOfWords();

    it("Tokenize", function () {
        let text = "Del salón en el ángulo oscuro, de su dueño tal vez olvidada."
        let t = bow.tokenize(text);
        console.log(t);
        expect(t).toEqual(["del", "salón", "en", "el", "ángulo", "oscuro", "de", "su", "dueño", "tal", "vez", "olvidada"]) ;
    });

});