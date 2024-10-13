const out = document.querySelector('.main .ann');
const gen = new Gen();

outputJson();
updateListeners();
updateButtons();
document.addEventListener('keyup', outputJson);
document.addEventListener('mouseup', updateButtons);

function Gen() {
    this.fields = function () {
        return document.querySelectorAll('.field');
    }
    this.out = function (text) {
        document.querySelector('#output').value = text;
    }
    this.get = function (selector) {
        return document.querySelector(selector);
    }
    this.getAll = function (selector) {
        return document.querySelectorAll(selector);
    }
}

function Ann(title, desc, fields) {
    this.title = title;
    this.desc = desc;
    this.fields = fields;
}

function Field(title, desc) {
    this.title = title;
    this.desc = desc;
}

function outputJson() {
    var title = gen.get('.ann #ann-title').value;
    var desc = gen.get('.ann #ann-desc').value;
    var fields = [];
    var cards = gen.fields();

    for (var i = 0; i < cards.length; i++) {
        var cTitle = cards[i].querySelector('.field #field-title').value;
        var cDesc = cards[i].querySelector('.field #field-desc').value;
        fields.push(new Field(cTitle, cDesc));
    }

    var ann = new Ann(title, desc, fields);
    gen.out(JSON.stringify(ann));
}

function updateButtons() {
    gen.getAll('.field_remove').forEach(button => {
        button.style.visibility = gen.fields().length > 1 ? 'visible' : 'hidden';
    });
}

function updateListeners() {
    gen.getAll('.field_remove').forEach(b => b.addEventListener('mousedown', e => {
        if (gen.fields().length > 1) {
            e.target.parentNode.remove(e.target);    
        }
        outputJson();
    }));
    gen.getAll('.field_new').forEach(b => {
        if (b.classList.contains('hasCloningListener')) {
            return;
        }

        b.classList.add('hasCloningListener');
        b.addEventListener('mousedown', () => {
            var fields = gen.fields();
            var og = fields[fields.length - 1];
            var clone = og.cloneNode(true);
            var main = gen.get('.fields');
        
            clone.setAttribute('id', 'field_' + (fields.length + 1));
            clone.querySelector('#field-title').value = '';
            clone.querySelector('#field-desc').value = '';
            clone.querySelector('.field_new').classList.remove('hasCloningListener');
        
            main.append(clone);
            outputJson();
            updateListeners();
        });
    });
}
