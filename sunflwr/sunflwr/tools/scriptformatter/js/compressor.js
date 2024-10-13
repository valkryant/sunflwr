function Compressor() {
    this.compress = function (scr) {
        var lines = scr.split('\n');
        var result = '';
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim().replace(/\s+/gi, ' ');
            result += line;

            if (line.length > 0) {
                if (!line.endsWith('{') && !line.endsWith('}') && !line.endsWith(';')) {
                    result += ';';
                }
                result += ' ';
            }
        }
        return result;
    }
    this.decompress = function (scr) {
        scr = this.compress(scr);
        var lines = scr.split(';');
        var result = '';
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            result += line + '\n';
        }

        var temp = result;
        var spaced = false;
        result = '';
        for (var i = 0; i < temp.length; i++) {
            var c = temp[i];

            if (c == '{') {
                result += c + '\n';
                spaced = true;
            }
            else if (c == '}') {
                result += c + '\n';
                spaced = true;
            }
            else if (c == ' ') {
                if (!spaced) {
                    result += c;
                    spaced = true;
                }
            }
            else {
                result += c;
                spaced = false;
            }
        }

        var opens = 0;
        temp = result;
        result = '';
        lines = temp.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (line.endsWith('{')) {
                opens++;
            }
            else if (line.startsWith('}') || line.endsWith('}')) {
                opens--;
            }

            var bl = line.endsWith('{');
            result += (bl && opens == 1 ? '\n' : '') + ' '.repeat((bl ? opens - 1 : opens) * 3) + line + '\n';
        }
        return result;
    }
}