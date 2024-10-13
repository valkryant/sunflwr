const pg = new Page();
const cp = new Compressor();
const input = pg.get('#input');
const outputC = pg.get('#output-compressed');
const outputD = pg.get('#output-decompressed');

pg.get('#button').addEventListener('click', () => {
    outputC.value = cp.compress(input.value);
    outputD.value = cp.decompress(input.value);
});
pg.get('#clear').addEventListener('click', () => {
    input.value = '';
    outputC.value = '';
    outputD.value = '';
});
pg.get('#paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(text => input.value = text);
});
pg.get('#copy-compressed').addEventListener('click', () => {
    navigator.clipboard.writeText(outputC.value);
});
pg.get('#copy-decompressed').addEventListener('click', () => {
    navigator.clipboard.writeText(outputD.value);
});

function Page() {
    this.get = function (selector) {
        return document.querySelector(selector);
    }
    this.getAll = function (selector) {
        return document.querySelectorAll(selector);
    }
}

input.value = "def module foo-module; def desc \"Foo module's description\"; on module_enable { send \"Hello world!\"; } on module_disable { send \"Goodbye world!\"; }";
outputC.value = cp.compress(input.value);
outputD.value = cp.decompress(input.value);