# Тесты для HTML кода
[![Build Status](https://travis-ci.org/urfu-2015/html-test-suite.svg)](https://travis-ci.org/urfu-2015/html-test-suite)

## Использование
Добавить в `package.json` в секцию `scripts`:  
`"test-html": "mocha ./node_modules/html-tests/task-stub/test"`

## Проверки
* Наличие 2х и более html-файла в корне проекта;
* Лишние пробелы:
  * после открывающих тегов;
  * перед закрывающими тегами, после `<`;
  * Перед и после `=`;
* Две пустыне строки подряд;
* Блочные теги внутри строчных;
* Блочные теги внутри `<p>`;
