/* global describe, it, global */

'use strict';

require('should');

var regExps = require('../task-stub/test/staff/regExps');
var utils = require('../task-stub/test/staff/utils');
var fs = require('fs');

var largeHtml = fs.readFileSync('test/html/large.html', 'utf-8');

describe('Тесты выражения поиска тегов.', function () {
    it('Должен корректно находиться <i>', function () {
        var pattern = regExps.tag('i');
        var html = largeHtml + '\n<i>Слово</i>';

        pattern.test(html).should.be.eql(true);
    });

    it('Должен корректно находиться < i data-some="some">', function () {
        var pattern = regExps.tag('i');
        var html = largeHtml + '\n< i data-some="some">Слово</i>';

        pattern.test(html).should.be.eql(true);
    });

    it('Не должен находиться <b>, если его нет.', function () {
        var pattern = regExps.tag('b');
        var html = largeHtml + '\n<blockquote>Слово</blockquote>';

        pattern.test(html).should.be.eql(false);
    });
});

describe('Длинные строки.', function () {
    it('Должны обнаруживаться строки длиной более 110 символов.', function () {
        var pattern = regExps.maxLineLength(110);
        var html = largeHtml + '\n	С появлением частичной поддержки ECMAScript 2015 в Chrome 45 и NodeJS 4, мы, веб' +
            'разработчики, вступили в новую эпоху отрасли, которая нам приносит не только «хлеб с маслом», но и' +
            'доставляет массу удовольствия.'; //210 символов

        pattern.test(html).should.be.eql(true);
    });

    it('Не должны обнаруживаться длинные строки там, где их нет.', function () {
        var pattern = regExps.maxLineLength(110);
        var html = largeHtml + '\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка\n' +
            'Короткая строка\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка' +
            '\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка\nКороткая строка';

        pattern.test(html).should.be.eql(false);
    });
});

//WIP
//describe('Пустые строки.', function () {
//    var pattern = regExps.twoLineBreaksInARow();
//
//    it('Должны обнаруживаться две пустые строки подряд.', function () {
//        var html = largeHtml + '\n\n<div>слово</div>';
//
//        pattern.test(html).should.be.eql(true);
//    });
//
//    it('Должны обнаруживаться две пустые строки подряд, в перемешку с пробелами.', function () {
//        var html = largeHtml + ' \n \n <div>слово</div>';
//
//        pattern.test(html).should.be.eql(true);
//    });
//
//    it('Не должны обнаруживаться две пустые строки подряд, если их нет.', function () {
//        pattern.test(largeHtml).should.be.eql(false);
//    });
//});

describe('Отступы.', function () {
    it('Поиск символов табуляции.', function () {
        var pattern = regExps.tabs();
        var html = largeHtml + '\n	<blockquote>Слово</blockquote>';

        pattern.test(html).should.be.eql(true);
    });

    it('Должны обнаруживаться отступы, не кратные четырем пробелам.', function () {
        var html = largeHtml + '\n   <blockquote>Слово</blockquote>'; // 3 пробела
        var found = utils.wrongSpacesChecker(html);

        (found > 0).should.be.eql(true);
    });

    it('Не должны обнаруживаться отступы, кратные четырем пробелам.', function () {
        var html = largeHtml + '\n    <blockquote>Слово   </blockquote>   '; // 4 пробела
        var found = utils.wrongSpacesChecker(html);

        (found).should.be.eql(0);
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
        var pattern = regExps.spaceBeforeClosingTag();

        it('Должен обнаруживаться пробел перед закрывающи тегом-1.', function () {
            var html = largeHtml + '\n<p>Слово </p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться пробел перед закрывающи тегом-2.', function () {
            var html = largeHtml + '\n<p>Слово<span>тест </span></p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Не должены обнаруживаться пробелы перед закрывающими тегами, если таких пробелов нет.', function () {
            var html = largeHtml + '\n< p >Слово< span >тест< /span >< /p >';

            pattern.test(html).should.be.eql(false);
        });
    });

    describe('Пробелы после символа <.', function () {
        var pattern = regExps.spaceAfterLessSign();

        it('Должен обнаруживаться пробел после символа <.', function () {
            var html = largeHtml + '\n< p>Слово</p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться перенос строки после символа <.', function () {
            var html = largeHtml + '\n<\np>Слово</p>';

            pattern.test(html).should.be.eql(true);
        });

        it('Не обнаруживаться пробел после &lt;', function () {
            var html = largeHtml + '\n&lt; слово';

            pattern.test(html).should.be.eql(false);
        });
    });

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

        it('Не должен обнаруживаться пробел перед = вне тегов', function () {
            var pattern = regExps.spaceAfterEquals();
            var html = largeHtml + '<p data-some="some" class="some">Слово = слово</p>';

            pattern.test(html).should.be.eql(false);
        });
    });
});

describe('Запрещенные атрибуты элементов.', function () {
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

