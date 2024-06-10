document.addEventListener("DOMContentLoaded", function () {
    let minValue, maxValue, answerNumber, orderNumber, gameRun;

    function initializeGame() {
        // Сбросить значения переменных
        minValue = 0;
        maxValue = 100;
        answerNumber = 0;
        orderNumber = 0;
        gameRun = false;

        // Открыть модальное окно для ввода диапазона чисел
        $('#rangeModal').modal('show');
    }

    // Обработчик события для подтверждения диапазона чисел
    document.getElementById('confirmRange').addEventListener('click', function () {
        $('#rangeModal').modal('hide');
        minValue = parseInt(document.getElementById('minValueInput').value) || 0;
        maxValue = parseInt(document.getElementById('maxValueInput').value) || 100;

        minValue = minValue > 999 ? 999 : minValue < -999 ? -999 : minValue;
        maxValue = maxValue > 999 ? 999 : maxValue < -999 ? -999 : maxValue;

        showModalMessage(`Загадайте любое целое число от ${minValue} до ${maxValue}, а я его угадаю`);

        answerNumber = Math.floor((minValue + maxValue) / 2);
        orderNumber = 1;
        gameRun = true;

        const orderNumberField = document.getElementById('orderNumberField');
        const answerField = document.getElementById('answerField');
        orderNumberField.innerText = orderNumber;
        const guessedNumberText = numberToText(answerNumber);
        answerField.innerText = `Вы загадали число ${guessedNumberText}?`;
    });

    function showModalMessage(message) {
        document.getElementById('messageContent').innerText = message;
        $('#messageModal').modal('show');
    }

    function generateQuestionPhrase() {
        const questionPhrases = [
            "Да это легко! Ты загадал...",
            "Наверное, это число...",
            "Может быть, это...",
            "Допустим, это число...",
            "Я думаю, это...",
            "Кажется, это..."
        ];

        // Генерируем случайный индекс из массива вопросов
        const randomIndex = Math.floor(Math.random() * questionPhrases.length);

        return questionPhrases[randomIndex];
    }

    function numberToText(number) {
        if (number === 0) {
            return 'ноль';
        }

        const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
        const teens = ['', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
        const tens = ['', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
        const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

        let result = '';

        // Разбиение числа на разряды
        const isNegative = number < 0;
        number = Math.abs(number); // Преобразуем число в положительное для удобства обработки
        const hundredsDigit = Math.floor(number / 100);
        const tensDigit = Math.floor((number % 100) / 10);
        const unitsDigit = number % 10;

        // Формирование текстового представления
        if (isNegative) {
            result += 'минус ';
        }
        if (hundredsDigit > 0) {
            result += hundreds[hundredsDigit] + ' ';
        }
        if (tensDigit === 1 && unitsDigit > 0) {
            result += teens[unitsDigit] + ' ';
        } else {
            result += tens[tensDigit] + ' ';
            result += units[unitsDigit] + ' ';
        }

        return result.trim();
    }

    document.getElementById('btnRetry').addEventListener('click', function () {
        initializeGame();
    });

    document.getElementById('btnEqual').addEventListener('click', function () {
        if (gameRun) {
            const phraseRandom = Math.round(Math.random() * 2);
            let answerPhrase;
            switch (phraseRandom) {
                case 0:
                    answerPhrase = `Я всегда угадываю\n\u{1F60E}`;
                    break;
                case 1:
                    answerPhrase = `Отлично! Я победил\n\u{1F973}`;
                    break;
                case 2:
                    answerPhrase = `Это было легко!\n\u{1F609}`;
                    break;
                default:
                    answerPhrase = `Что-то пошло не так..\n\u{1F914}`;
            }

            document.getElementById('answerField').innerText = answerPhrase;
            gameRun = false;
        }
    });

// Обработчик для кнопки "Больше"
document.getElementById('btnOver').addEventListener('click', function () {
    if (gameRun) {
        if (minValue === maxValue) {
            endGame(getRandomMessage());
        } else {
            minValue = answerNumber + 1;
            guessNextNumber();
        }
    }
});

// Обработчик для кнопки "Меньше"
document.getElementById('btnLess').addEventListener('click', function () {
    if (gameRun) {
        if (minValue === maxValue) {
            endGame(getRandomMessage());
        } else {
            maxValue = answerNumber - 1;
            if (maxValue < minValue) {
                resetGame();
            } else {
                guessNextNumber();
            }
        }
    }
});

// Функция для завершения игры с произвольным сообщением
function endGame(message) {
    document.getElementById('answerField').innerText = message;
    gameRun = false;
}

// Функция для предположения следующего числа
function guessNextNumber() {
    answerNumber = Math.floor((minValue + maxValue) / 2);
    orderNumber++;
    document.getElementById('orderNumberField').innerText = orderNumber;
    const guessedNumberText = numberToText(answerNumber);
    const questionPhrase = generateQuestionPhrase();
    let answerText = (guessedNumberText.length <= 20) ?
        `${questionPhrase} ${guessedNumberText}?` :
        `${questionPhrase} ${answerNumber}?`;
    document.getElementById('answerField').innerText = answerText;
}

// Функция для сброса игры
function resetGame() {
    endGame(getRandomMessage());
}

// Возвращает случайное сообщение
function getRandomMessage() {
    const messages = [
        "Вы загадали неправильное число!\n\u{1F914}",
        "Я сдаюсь..\n\u{1F92F}",
        "Попробуй еще раз!\n\u{1F609}",
        "Что-то пошло не так..\n\u{1F914}"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Инициализация игры
initializeGame();
});