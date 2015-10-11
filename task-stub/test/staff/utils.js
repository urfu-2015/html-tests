exports.wrongSpacesChecker = function (html, showMessage) {
    var found = 0;

    html.split('\n').forEach(function (line, i) {
        var spaces = line.match(/\s*/)[0];

        if (spaces.length === 0) return;

        if (spaces.length % 4 !== 0) {
            found++;

            if (showMessage) {
                console.error('    Ошибка. Строка ' + (i + 1) + '. Кол-во пробелов в отступе не кратно четырем.');
            }
        }
    });

    return found;
};
