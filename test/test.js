/* global describe, it, global */

'use strict';

require('should');

var regExps = require('../task-stub/test/staff/regExps');
var utils = require('../task-stub/test/staff/utils');
var fs = require('fs');

var largeHtml = fs.readFileSync('test/html/large.html', 'utf-8');


describe('Пустые строки.', function () {
    it('Должны обнаруживаться две пустые строки подряд.', function () {
        var pattern = regExps.twoLineBreaksInARow();
        var html = largeHtml + '\n\n<div>слово</div>';

        pattern.test(html).should.be.eql(true);
    });

    it('Должны обнаруживаться две пустые строки подряд в перемешку с пробелами.', function () {
        var pattern = regExps.twoLineBreaksInARow();
        var html = largeHtml + '\n  \n  <div>слово</div>';

        pattern.test(html).should.be.eql(true);
    });

    it('Не должны обнаруживаться две пустые строки подряд, если их нет.', function () {
        var pattern = regExps.twoLineBreaksInARow();
        var html = largeHtml + '<div> \n  \n <div>слово</div>';
        pattern.test(html).should.be.eql(false);
    });
});

describe('Поиск пробелов в неположенных местах.', function () {
    describe('Выражение для поиска пробелов после открывающих тегов.', function () {
        var pattern = regExps.spaceAfterTag();

        it('Должен обнаруживаться пробел после открывающего тега-1.', function () {
            var html = largeHtml + '\n<p> Слово</p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться пробел после открывающего тега-2.', function () {
            var html = largeHtml + '\n<p>Слово<span> тест</span></p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Не должены обнаруживаться пробелы после открывающихся тегов, если таких пробелов нет.', function () {
            var html = largeHtml + '\n< p >\nСлово< span >тест< /span >< /p >';

            pattern.test(html).should.be.eql(false);
        });
    });

    describe('Выражение для поиска пробелов перед закрывающими тегами.', function () {
        it('Должен обнаруживаться пробел перед закрывающи тегом-1.', function () {
            var pattern = regExps.spaceBeforeClosingTag();
            var html = largeHtml + '\n<p>Слово </p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться пробел перед закрывающи тегом-2.', function () {
            var pattern = regExps.spaceBeforeClosingTag();
            var html = largeHtml + '\n<p>Слово<span>тест </span></p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Не должены обнаруживаться пробелы перед закрывающими тегами, если таких пробелов нет.', function () {
            var pattern = regExps.spaceBeforeClosingTag();
            var html = largeHtml + '\n< p >Слово< span >тест< /span >< /p >';

            pattern.test(html).should.be.eql(false);
        });
    });

    describe('Пробелы после символа <.', function () {
        it('Должен обнаруживаться пробел после символа <.', function () {
            var pattern = regExps.spaceAfterLessSign();
            var html = largeHtml + '\n< p>Слово</p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться перенос строки после символа <.', function () {
            var pattern = regExps.spaceAfterLessSign();
            var html = largeHtml + '\n<\np>Слово</p>';

            var found = pattern.test(html);
            found.should.be.eql(true);
        });

        it('Не должен обнаруживаться пробел после &lt;', function () {
            var pattern = regExps.spaceAfterLessSign();
            var html = largeHtml + '\n&lt; слово';

            pattern.test(html).should.be.eql(false);
        });
    });
});

describe('Использование и оформление атрибутов.', function () {
    describe('Обнаружение запрещенных атрибутов.', function () {
        it('Обнаружение атрибута style.', function () {
            var html = largeHtml + '\n<p style="color: #000;">Слово </p>';
            var pattern = regExps.attrs('style');

            pattern.test(html).should.be.eql(true);
        });

        describe('Обнаружение атрибута border.', function () {
            it('border="1"', function () {
                var html = largeHtml + '\n<img border="1">';
                var pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border=\'1\'', function () {
                var html = largeHtml + '\n<img border=\'1\'>';
                var pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border=1', function () {
                var html = largeHtml + '\n<img border=1>';
                var pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border не должен обнаруживаться в различных ситуациях', function () {
                var html = largeHtml + '\n<table class="border" style="border: 1px solid #000;">border</table>';
                var pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(false);
            });
        });
    });

    describe('Обнаружение неправильного оформления атрибутов.', function () {
        describe('Пробелы при написании атрибутов.', function () {
            it('Должен обнаруживаться пробел перед =', function () {
                var pattern = regExps.spaceBeforeEquals();
                var html = largeHtml + '<p data-some="some" class ="some">Слово</p>';

                pattern.test(html).should.be.eql(true);
            });

            it('Не должен обнаруживаться пробел перед =, если его нет', function () {
                var pattern = regExps.spaceBeforeEquals();
                var html = largeHtml + '<p data-some="some" class="some">Слово</p>';

                pattern.test(html).should.be.eql(false);
            });

            it('Не должен обнаруживаться пробел перед = вне тегов', function () {
                var pattern = regExps.spaceBeforeEquals();
                var html = largeHtml + '<p data-some="some" class="some">Слово = слово</p>';

                pattern.test(html).should.be.eql(false);
            });

            it('Должен обнаруживаться пробел после =', function () {
                var pattern = regExps.spaceAfterEquals();
                var html = largeHtml + '<p data-some="some" class= "some">Слово</p>';

                pattern.test(html).should.be.eql(true);
            });

            it('Не должен обнаруживаться пробел после =, если его нет', function () {
                var pattern = regExps.spaceAfterEquals();
                var html = largeHtml + '<p data-some="some" class="some">Слово</p>';

                pattern.test(html).should.be.eql(false);
            });

            it('Не должно обнаруживаться пробел после =, если = находится внутри значения атрибута.', function () {
                var pattern = regExps.spaceAfterEquals();
                var html = largeHtml + '<video src="https://ya.ru?ratebypass= \n"';

                pattern.test(html).should.be.eql(false);
            });

            it('Не должен обнаруживаться пробел перед = вне тегов', function () {
                var pattern = regExps.spaceAfterEquals();
                var html = largeHtml + '<p data-some="some" class="some">Слово</p>';

                pattern.test(html).should.be.eql(false);
            });
        });
    });
});

describe('Неправильная вложенность тегов.', function () {
    describe('Обнаружение блочных тегов внутри строчных.', function () {
        it('Должен обнаруживаться <div> в <span> в простых ситуациях', function () {
            var html = 'Начало строки\n<span><div>bad</div></span>\n' +
                '\nКонец строки<div>Слово</div>' +
                '\n<span>\n<div></div></span>';

            utils.getBlockInsideInline(html, false).should.be.eql(1);
        });

        it('Должен обнаруживаться <div> в <span> в сложных ситуациях.', function () {
            var html = largeHtml + '\n<span>\n  Некий текст<div>Слово</div></span>';

            utils.getBlockInsideInline(html, false).should.be.eql(1);
        });
    });

    describe('Обнаружение блочных теги внутри параграфов.', function () {
        it('Должен обнаруживаться <div> внутри <p>.', function () {
            var html = largeHtml + '\n<p>\n  Некий текст<div>Слово</div></p>';
            utils.getBlockInsideP(html, false).should.be.eql(1);
        });

        it('Должен обнаруживаться <table> внутри <p>.', function () {
            var html = largeHtml + '\n<p>\n  Некий текст<table>Слово</table></p>';
            utils.getBlockInsideP(html, false).should.be.eql(1);
        });

        it('Не должег обнаруживаться <table> внутри <p>, если его нет.', function () {
            var html = largeHtml + '\n<p>\n  Некий текст</p><table>Слово</table>';
            utils.getBlockInsideP(html, false).should.be.eql(0);
        });
    });
});
