exports.tag = function (tag) {
    return new RegExp('\\<\\s*' + tag + '(\\s.*)?\\>');
};

exports.tabs = function () {
    return /\t/;
};

exports.spaceAfterTag = function () {
    return /\<[^\/\>]+\>[^\S\r\n]/;
};

exports.spaceBeforeClosingTag = function () {
    return /[^\s]+[^\S\r\n]\<\/[-\w]+\>/i;
};

exports.attrs = function (attr) {
    return new RegExp('\<.+' + attr + '\\s*=[^<>]*\>');
};

exports.spaceAfterLessSign = function () {
    return /\<\s/;
};

exports.spaceBeforeLessSign = function () {
    return /\<\s/;
};

exports.maxLineLength = function (length) {
    return new RegExp('\\s*[^\\s][^\\n\\r]{' + length + '}');
};

//WIP
//exports.twoLineBreaksInARow = function () {
//    return /\n[\s^\n\r]*\n/;
//};

exports.spaceBeforeEquals = function () {
    return /\<[^\>]+\s\=/;
};

exports.spaceAfterEquals = function () {
    return /\<[^\>]+\=\s/;
};
