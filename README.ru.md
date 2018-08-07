# Фура с дизлайками

Tampermonkey скрипт для массового дизлайка видео на канале youtube.

![](http://img-fotki.yandex.ru/get/9827/203537249.14/0_13633e_a2be4aec_orig.png)

## Требования
* [Firefox](https://www.mozilla.org/firefox/new/) [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
* [Chrome](https://www.google.com/chrome/) [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

## Установка
Перейти по ссылке https://github.com/1v/dislike-truck/raw/master/dislike-truck.user.js

## Применение

Кнопка "Разгрузить фуры" проставляет дизлайки на всех видео канала. Перед разгрузкой нужно выбрать аккаунт. При этом выбранный аккаунт запоминается и не требует повторной авторизации после перезагрузки страницы.

Кнопка "Регистрация" позволяет выбрать другой аккаунт и запускает процесс разгрузки (на выбор аккаунта отводится 15 секунд).

Т.е. если у вас один аккаунт, то можно сразу нажимать "Разгрузить фуры". А кнопка "Регистрация" то же самое только с принудительным выбором аккаунта.

Если кнопка "Разгрузить фуры" не запоминает ваш аккаунт, то скорее всего у вас youtube-аккаунт, а не google-аккаунт.

## Баги

* В консоли появляется много ошибок 'no element found'. Это баг Firefox [bugzilla.mozilla.org](https://bugzilla.mozilla.org/show_bug.cgi?id=884693).
