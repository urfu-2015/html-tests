var html = require('./getHtml').split('\n');

module.exports = function(pattern, message){
    console.log('');

    html.forEach(function(line, i){
        var index = line.search(pattern);
        if (index !== -1) {
            var lineNumber = i + 1;
            console.error('    Ошибка. Строка ' + lineNumber + ' символ ' + (index + 1) + '. ' + message);
        }
    });

    console.log('');
};