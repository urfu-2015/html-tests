var blockElements = [
    'address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'fieldset', 'figcaption', 'figure',
    'footer','form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header','hgroup', 'hr', 'main', 'nav', 'noscript',
    'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'
];

var inlineElements = [
    'b', 'big', 'i', 'small', 'tt', 'abbr', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'a', 'bdo',
    'br', 'img', 'map', 'object', 'q', 'script', 'span', 'sub', 'sup', 'button', 'input', 'label', 'select', 'textarea',
    'image'
];

var emptyElements = [
    'link',' track', 'param', 'area', 'command', 'col', 'base', 'meta', 'hr', 'source', 'img', 'keygen', 'br', 'wbr',
    'input'
];

var error = require('../error-output');

exports.wrongSpacesChecker = function (html, showMessage) {
    var found = 0;

    html.split('\n').forEach(function (line, i) {
        var spaces = line.match(/^[^\t\S]+/);
        if (!spaces) return;

        if (spaces[0].length % 4 !== 0) {
            found++;

            if (showMessage) {
                console.error('    Ошибка. Строка ' + (i + 1) + '. Кол-во пробелов в отступе не кратно четырем.');
            }
        }
    });

    return found;
};

exports.getClosedEmptyElements = function (html, showMessage) {
    var found = 0;

    emptyElements.forEach(function(emptyElem){
        var pattern = new RegExp('<\\s*' + emptyElem + '[^>\/]*\/>', 'g');

        if (pattern.test(html)) {
            found ++;

            if (showMessage !== false) {
                var msg = 'Закрытый одиночный тег ' + emptyElem + '.';
                error(pattern, msg, html);
            }
        }
    });

    return found;
};

exports.getBlockInsideInline = function (html, showMessage) {
    var msg = showMessage !== false ? 'Строчный тег {{elem}}, в который вложен блочный {{prohibited}}.' : false;
    return checkIncorrectBlocksLocation(html, inlineElements, blockElements, msg);
};

exports.getBlockInsideP = function (html, showMessage) {
    var msg = showMessage !== false ? 'Блочный элемент {{prohibited}} внутри тега <p>.' : false;
    return checkIncorrectBlocksLocation(html, ['p'], blockElements, msg);
};

exports.findImagesWithoutAlt = function (html, showMessage) {
    var pattern = /<\s*img[^>]*>/ig;
    var images = html.match(pattern) || [];
    var found = 0;

    images.forEach(function (image) {
        var hasAlt = /\salt=(?!(""|''))/.test(image);

        if (!hasAlt) {
            if (showMessage !== false) {
                error(pattern, 'Картинка с отсутствующим или пустым атрибутом alt.', html);
            }

            found++;
        }
    });

    return found;
};

function checkIncorrectBlocksLocation (html, parents, prohibitedChildren, message) {
    var count = 0;

    parents.forEach( function (elem) {
        prohibitedChildren.forEach(function (prohibited) {

            var pattern = new RegExp('\<\\s*' + elem + '[^\>\<]*\>[^\<]*\<\\s*(' + prohibited +
                ')[^\>]*\>.*<\/\\1>.*<\/' + elem + '>', 'g');

            if (pattern.test(html)) {
                count ++;

                if (message) {
                    message = message.replace('{{elem}}', '<' + elem + '>');
                    message = message.replace('{{prohibited}}', '<' + prohibited + '>');
                    error(pattern, message, html);
                }
            }
        });
    });

    return count;
}
