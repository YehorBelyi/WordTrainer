const guessArray = [];
const rightGuess = [];
const wrongGuess = [];

let index = 0;
let isToggled = false;

const wordsToTranslate = new Map([
    ["Agreement", "Згода"], ["Anniversary", "Річниця"], ["Development", "Розвиток"],
    ["Burglary", "Кража"], ["Appointment", "Зустріч"], ["Flavour", "Смак"],
    ["Inevitable", "Неминуче"], ["Vehicle", "Транспорт"], ["Glance", "Погляд"],
    ["Admiration", "Захоплення"]]);

$(document).ready(function () {

    const wordVariable = $(".word-card p");
    const wordCard = $(".word-card");
    const amountOfWords = wordsToTranslate.size;

    const wordsInfo = $(".word-count p");
    wordsInfo.text(`1/${amountOfWords}`);

    const words = Array.from(wordsToTranslate.keys());

    const nextButton = $(".right img");
    const previousButton = $(".left img");
    const guessArea = $(".user-guess input");

    nextButton.click(() => showNextWord(wordVariable, nextButton, previousButton, wordsInfo));
    previousButton.click(() => showPreviousWord(wordVariable, nextButton, previousButton, wordsInfo));
    wordCard.click(() => showTranslation(wordVariable, wordsToTranslate));
    guessArea.on('keypress', (e) => {
        if (e.which == 13) {
            checkGuess(wordsToTranslate, guessArea);
        }
    });

    setRandomWords(words);
    showWord(wordVariable);

    previousButton.hide();
});

const setRandomWords = (words) => {
    while (guessArray.length < 10) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const key = words[randomIndex];

        if (!guessArray.includes(key)) {
            guessArray.push(key);
        }
    }
}

const showWord = (wordVariable) => {
    wordVariable.text(`${guessArray[index]}`);
}

const showNextWord = (wordVariable, nextButton, previousButton, wordsInfo) => {
    if (index < guessArray.length - 1) {
        isToggled = false;
        wordVariable.text(`${guessArray[++index]}`);
        wordsInfo.text(`${index + 1}/${guessArray.length}`);
    }

    if (index === guessArray.length - 1) {
        nextButton.hide();
    }
    previousButton.show();
}

const showPreviousWord = (wordVariable, nextButton, previousButton, wordsInfo) => {
    if (index > 0) {
        isToggled = false;
        wordVariable.text(`${guessArray[--index]}`);
        wordsInfo.text(`${index + 1}/${guessArray.length}`);
    }

    if (index === 0) {
        previousButton.hide();
    }
    nextButton.show();
}

const showTranslation = (wordVariable, wordsToTranslate) => {
    if (!isToggled) {
        let thisWord = wordsToTranslate.get(guessArray[index]);
        wordVariable.text(`${thisWord}`);
        isToggled = true;
    } else {
        wordVariable.text(`${guessArray[index]}`);
        isToggled = false;
    }
}

const checkGuess = (wordsToTranslate, guessArea) => {
    const rightCount = $(".right-answer p:last");
    const wrongCount = $(".wrong-answer p:last");

    const userGuess = guessArea.val().trim().toLowerCase();
    const trueGuess = wordsToTranslate.get(guessArray[index]).trim().toLowerCase();

    if (userGuess === "") {
        alert("Ви не ввели слово для перевірки!");
        return;
    }
    else {
        if (userGuess === trueGuess) {
            if (!rightGuess.includes(guessArray[index])) {
                alert("Правильно!");
                rightGuess.push(guessArray[index]);
                rightCount.text(`${rightGuess.length}`);
            } else {
                alert("Ви вже переклали це слово!");
            }
        } else {
            if (!rightGuess.includes(guessArray[index])) {
                if (!wrongGuess.includes(guessArray[index])) {
                    alert("Неправильно!");
                    wrongGuess.push(guessArray[index]);
                    wrongCount.text(`${wrongGuess.length}`);
                } else {
                    alert("У вас не вийшло перекласти дане слово. Спробуйте в інший раз!");
                }
            } else {
                alert("Це слово вже було правильно перекладено. Спробуйте інше слово.");
            }
        }
    }

    guessArea.val("");

    if (rightGuess.length + wrongGuess.length === 10) {
        guessArea.prop('disabled', true);
        checkUserLevel();
    }
}


const checkUserLevel = () => {
    const totalWords = guessArray.length;
    const rightAnswers = rightGuess.length;
    let userRating = "";

    const userLevel = (rightAnswers / totalWords) * 100;

    if (userLevel < 20) {
        userRating = "F";
    } else if (userLevel < 40) {
        userRating = "D";
    } else if (userLevel < 60) {
        userRating = "C";
    } else if (userLevel < 80) {
        userRating = "B";
    } else if (userLevel <= 100) {
        userRating = "A";
    }

    const message = `Вітаємо із закінченням перекладу слів!\nВаш рівень знань: ${userRating}\nБажаєте почати спочатку?`;
    if (confirm(message)) {
        location.reload();
    }
}