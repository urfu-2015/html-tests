module.exports = function(pattern, message, html) {
    console.log('');

    html = html || require('./getHtml');
    var matches = html.match(pattern);

    var currentLine = 1;

    matches.forEach(function(match){
        var idx = html.indexOf(match);

        var htmlBeforeMatch = html.substr(0, idx);

        var linesBefore = htmlBeforeMatch.match(/\n/g);
        currentLine += linesBefore ? linesBefore.length : 0;

        console.log('Ошибка в строке ' + currentLine + '. ' + message);

        var linesInMatch = match.match(/\n/g);
        currentLine += linesInMatch ? linesInMatch.length : 0;

        var htmlToCut = html.substr(0, idx + match.length);

        html = html.replace(htmlToCut, '');
    });

    console.log('');
};
