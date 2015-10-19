exports.tag = function (tag) {
    return new RegExp('<\\s*' + tag + '(\\s.*)?>', 'g');
};

exports.tabs = function () {
    return new RegExp('\\t', 'g');
};

exports.spaceAfterTag = function () {
    return new RegExp('<[^\/>]+>[^\\S\\r\\n]', 'g');
};

exports.spaceBeforeClosingTag = function () {
    return new RegExp('[^\\s]+[^\\S\\r\\n]<\/[-\\w]+>', 'ig');
};

exports.attrs = function (attr) {
    return new RegExp('<.+' + attr + '\\s*=[^<>]*>', 'g');
};

exports.spaceAfterLessSign = function () {
    return new RegExp('<\\s', 'g');
};

exports.spaceBeforeLessSign = function () {
    return new RegExp('<\\s', 'g');
};

exports.maxLineLength = function (length) {
    return new RegExp('[^\\n]{' + length + '}', 'g');
};

exports.spaceBeforeEquals = function () {
    return new RegExp('<\\s*[^\\s>]+[^>]*\\s[^\\s>=]+[^\\n\\S]=[^>]*>', 'g');
};

exports.spaceAfterEquals = function () {
    return new RegExp('<\\s*[^\\s>]+[^>]*\\s[^\\s>=]+=[^\\n\\S][^>]*>', 'g');
};

exports.twoLineBreaksInARow = function () {
    return new RegExp('\\n[^\\S\\n\\r]*\\n[^\\S\\n\\r]*\\n', 'g');
};

exports.wrongQuoteInAttribute = function () {
    return new RegExp('<\\s*[^\\s>]+[^>]*\\s[^\\s>=]+=[^"][^>]*>', 'g');
};

exports.imgWithoutAlt = function () {
    return new RegExp('<\\s*img\\s[^alt="]*', 'g');
};
