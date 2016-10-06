/* global describe, it, global */

'use strict';

require('should');

var html = require('./getHtml');
var error = require('./error-output');
var regExps = require('./staff/regExps');
var utils = require('./staff/utils');

describe('Сodestyle.', function () {
    it('Не должно быть пробелов после открывающих тегов.', function () {
        var pattern = regExps.spaceAfterTag();
        var hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Открывающий тег, после которого стоит пробел.');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов перед закрывающими тегами.', function () {
        var pattern = regExps.spaceBeforeClosingTag();
        var hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после слова, за которым идет закрывающий тег.');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов после символа <.', function () {
        var pattern = regExps.spaceAfterLessSign();
        var hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после символа "<".');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов перед символом >.', function () {
        var pattern = regExps.spaceBeforeLessSign();
        var hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после символа "<".');
        }

        hasViolation.should.be.eql(false);
    });

    describe('Использование и оформление атрибутов.', function () {
        it('Не должно быть пробелов после = при использовании атрибутов.', function () {
            var pattern = regExps.spaceAfterEquals();
            var hasViolation = pattern.test(html);

            if (hasViolation) {
                error(pattern, 'Пробел после "=".');
            }

            hasViolation.should.be.eql(false);
        });

        it('Не должно быть пробелов перед = при использовании атрибутов.', function () {
            var pattern = regExps.spaceBeforeEquals();
            var hasViolation = pattern.test(html);

            if (hasViolation) {
                error(pattern, 'Пробел перед "=".');
            }

            hasViolation.should.be.eql(false);
        });
    });

    it('Не должно быть двух и более идущих подряд пустых строк.', function () {
        var pattern = regExps.twoLineBreaksInARow();
        var hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'После нее идут две или более пустые строки.');
        }

        hasViolation.should.be.eql(false);
    });

    describe('Проверка корректности вложенности блоков.', function () {
        it('Не должно быть блочных тегов внутри строчных.', function () {
            utils.getBlockInsideInline(html).should.be.eql(0);
        });

        it('Не должно быть блочных тегов внутри параграфов (<p>).', function () {
            utils.getBlockInsideP(html).should.be.eql(0);
        });
    });
});
