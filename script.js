// Функция для подсветки активной секции
function highlightActiveSection() {
    const navLinks = document.querySelectorAll('nav a');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    // Удаляем активный класс со всех ссылок
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Проходим по каждой ссылке и ищем соответствующий раздел
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            const section = document.getElementById(sectionId);
            
            if (section) {
                const rect = section.getBoundingClientRect();
                // Если секция в видимой области (учитываем высоту header)
                if (rect.top <= headerHeight + 100 && rect.bottom > 0) {
                    link.classList.add('active');
                }
            }
        }
    });
}

// Вызываем функцию при прокручивании с debounce для оптимизации
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(highlightActiveSection, 50);
});

// Вызываем при загрузке страницы
window.addEventListener('load', highlightActiveSection);

// Управление дропдауном мини-игр
const dropdownItems = document.querySelectorAll('nav li.dropdown');
dropdownItems.forEach(dropdown => {
    const link = dropdown.querySelector('a:first-child');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (link && menu) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        // Закрываем меню при клике на пункт подменю
        menu.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        });
    }
});

// Закрываем дропдаун при клике вне его
document.addEventListener('click', (e) => {
    dropdownItems.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});

// Carousel/Scroller для проектов
const scrollerContainer = document.querySelector('.scroller-container');

// Проверяем, существует ли элемент перед использованием
if (scrollerContainer) {
    const scroller = scrollerContainer.querySelector('.scroller');
    const nextBtn = scrollerContainer.querySelector('.btn.next');
    const prevBtn = scrollerContainer.querySelector('.btn.prev');
    const itemWidth = scrollerContainer.querySelector('.item').clientWidth;
    const tolerance = 50; // допуск для margin и неточностей

    nextBtn.addEventListener('click', scrollToNextItem);
    prevBtn.addEventListener('click', scrollToPrevItem);
      
    function scrollToNextItem() {
       if(scroller.scrollLeft < (scroller.scrollWidth - itemWidth - tolerance))
           // Позиция прокрутки расположена не в начале последнего элемента
           scroller.scrollBy({left: itemWidth, top: 0, behavior:'smooth'});
       else
           // Достигнут последний элемент. Возвращаемся к первому элементу
           scroller.scrollTo({left: 0, top: 0, behavior:'smooth'});
    }

    function scrollToPrevItem() {
       if(scroller.scrollLeft > tolerance)
           // Позиция прокрутки расположена не в начале первого элемента
           scroller.scrollBy({left: -itemWidth, top: 0, behavior:'smooth'});
       else
           // Это первый элемент. Переходим к последнему элементу
            scroller.scrollTo({left: scroller.scrollWidth - itemWidth - tolerance, top: 0, behavior:'smooth'});
    }
}

// Валидация контактной формы
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения формы
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Очищаем предыдущее сообщение
        formStatus.textContent = '';
        formStatus.className = '';
        
        // Валидация
        let isValid = true;
        let errorMessage = '';
        
        // Проверка имени
        if (name.length < 2) {
            isValid = false;
            errorMessage += 'Имя должно содержать минимум 2 символа. ';
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            errorMessage += 'Пожалуйста, введите корректный email адрес. ';
        }
        
        // Проверка сообщения
        if (message.length < 10) {
            isValid = false;
            errorMessage += 'Сообщение должно содержать минимум 10 символов. ';
        }
        
        if (isValid) {
            // Если форма валидна, показываем сообщение об успехе
            formStatus.textContent = '✓ Спасибо! Ваше сообщение успешно отправлено!';
            formStatus.className = 'success';
            
            // Очищаем форму
            contactForm.reset();
            
            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = '';
            }, 5000);
            
            // Здесь можно добавить код для отправки на сервер
            console.log('Форма отправлена:', { name, email, message });
        } else {
            // Если форма невалидна, показываем ошибки
            formStatus.textContent = '✗ ' + errorMessage;
            formStatus.className = 'error';
        }
    });
}

// Плавная прокрутка при клике на ссылку в навигации
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});


// Кликер мини игра

let startClickerTime = null;
let clickerScore = 0;
let clickerUpdateInterval = null;
let clickerBestScore = 0;
let buttonColor = 0;

const clickerButton = document.getElementById('clicker-button');
const clickerScoreLabel = document.getElementById('clicker-score');

// Загружаем лучший результат из localStorage при загрузке страницы
if (clickerScoreLabel) {
    const savedBestScore = localStorage.getItem('clickerBestScore');
    if (savedBestScore) {
        clickerBestScore = parseInt(savedBestScore);
        clickerScoreLabel.textContent = 'Лучший результат: ' + clickerBestScore + ' очков';
    }
}

// Проверяем, существует ли элемент перед добавлением обработчика
if (clickerButton) {
    clickerButton.addEventListener('click', clickerOnClick);
}

function clickerOnClick() {
    if (!startClickerTime) {
        startClickerTime = Date.now();
        clickerScore = 1;
        clickerButton.style.backgroundColor = `rgb(255, 199, ${buttonColor})`;
        if (buttonColor<99){
            buttonColor += 10;
        } else {
            buttonColor = 0;
        }
        clickerButton.textContent = 'Продолжай кликать!';
        updateClickerDisplay();
        // Обновляем время каждые 100мс
        if (clickerUpdateInterval) clearInterval(clickerUpdateInterval);
        clickerUpdateInterval = setInterval(updateClickerDisplay, 100);
    } else if (Date.now() - startClickerTime >= 30000) {
        clearInterval(clickerUpdateInterval);
        
        if (clickerScore > clickerBestScore) {
            clickerBestScore = clickerScore;
            localStorage.setItem('clickerBestScore', clickerBestScore);
        }
        
        clickerButton.textContent = 'Время вышло! Твой результат: ' + clickerScore + ' очков. Лучший: ' + clickerBestScore + '. Кликни для нового раунда.';
        clickerScoreLabel.textContent = '';
        startClickerTime = null;
        clickerScore = 0;
    }
    else {
        clickerScore += 1;
        clickerButton.style.backgroundColor = `rgb(255, 199, ${buttonColor})`;
        if (buttonColor<99){
            buttonColor += 10;
        } else {
            buttonColor = 0;
        }
        updateClickerDisplay();
    }
}

function updateClickerDisplay() {
    if (startClickerTime && clickerScoreLabel) {
        const elapsed = Math.floor((Date.now() - startClickerTime) / 1000);
        const remaining = 30 - elapsed;
        
        // Если время вышло, останавливаем обновление
        if (remaining <= 0) {
            clearInterval(clickerUpdateInterval);
            
            // Проверяем, является ли это новым рекордом
            if (clickerScore > clickerBestScore) {
                clickerBestScore = clickerScore;
                localStorage.setItem('clickerBestScore', clickerBestScore);
            }
            
            clickerButton.textContent = 'Время вышло! Твой результат: ' + clickerScore + ' очков. Лучший: ' + clickerBestScore + '. Кликни для нового раунда.';
            clickerScoreLabel.textContent = '';
            startClickerTime = null;
            clickerScore = 0;
            return;
        }
        
        clickerScoreLabel.textContent = 'Очков: ' + clickerScore + ' | Оставшееся время: ' + remaining + ' сек | Лучший: ' + clickerBestScore;
    }
}

document.getElementById('clicker-null').addEventListener('click', function() {
    clickerScore = 0;
    clickerScoreLabel.textContent = 'Очков: ' + clickerScore + ' | Оставшееся время: 30 сек | Лучший: ' + clickerBestScore;
});




// Генератор приключений
let adnventureIsGenerated = false;

const adventureProtagonist = ['рыцарь', 'волшебник', 'лучник', 'вор', 'паладин', 'ассасин', 'берсерк', 'жрец'];
const adventureLocation = ['в замке', 'в лесу', 'на горе', 'в подземелье', 'на острове', 'в пустыне', 'на болоте', 'в городе'];
const adventureAntagonist = ['дракон', 'тролль', 'гоблин', 'ведьма', 'вампир', 'зомби', 'демон', 'орк'];

const adventureButton = document.getElementById('adventure-generator-button');
const adventureResult = document.getElementById('adventure-generator-result');

adventureButton.addEventListener('click', generateAdventure);

//Загрузка истории приключений
let adventureHistory = [];

window.addEventListener('load', function() {
    const savedHistory = localStorage.getItem('adventureHistory');
    if (savedHistory) {
        adventureHistory = JSON.parse(savedHistory);
    }
    loadAdventureHistory();
});

function generateAdventure() {
    let protagonist = adventureProtagonist[Math.floor(Math.random() * adventureProtagonist.length)];
    let location = adventureLocation[Math.floor(Math.random() * adventureLocation.length)];
    let antagonist = adventureAntagonist[Math.floor(Math.random() * adventureAntagonist.length)];
    let adventureText = `Ваш персонаж — ${protagonist} находится ${location} и сражается с ${antagonist}.`;
    adventureResult.textContent = adventureText;
    
    // Создаем объект с текстом и временем создания
    const adventureObject = {
        text: adventureText,
        timestamp: new Date().toLocaleString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        })
    };
    
    // Если больше 3 элементов, то удалится последний, добавляем в начало новый элемент
    adventureHistory.unshift(adventureObject)
    if (adventureHistory.length > 3) {
        adventureHistory.pop();
    }
    localStorage.setItem('adventureHistory', JSON.stringify(adventureHistory));

    loadAdventureHistory();

    if (!adnventureIsGenerated) {
        adventureButton.textContent = 'Сгенерировать ещё раз';
        adnventureIsGenerated = true;
    };
}

function loadAdventureHistory() {
    const historyList = document.getElementById('adventure-history-list');
    historyList.innerHTML = '';
    adventureHistory.forEach(adventure => {
        const li = document.createElement('li');
        
        // Проверяем, является ли элемент объектом или старой строкой
        if (typeof adventure === 'object' && adventure.text) {
            const timestamp = document.createElement('div');
            timestamp.className = 'adventure-timestamp';
            timestamp.textContent = adventure.timestamp;
            
            const text = document.createElement('div');
            text.className = 'adventure-text';
            text.textContent = adventure.text;
            
            li.appendChild(timestamp);
            li.appendChild(text);
        } else {
            // Для обратной совместимости со старыми записями
            li.textContent = adventure;
        }
        
        historyList.appendChild(li);
    });
}

// Угадай число
const inputGuestNumber = document.getElementById('guestNumberInput');
const buttonGuestNumber = document.getElementById('guestNumberButton');
const resultGuestNumber = document.getElementById('guestNumberResult');
const restartGuestNumberButton = document.getElementById('restartGuestNumber');
const triesCount = document.getElementById('triesCount');
let remainingTries = 7;
let randomNumber = Math.floor(Math.random() * 101);
let inputIsValid = false;

inputGuestNumber.addEventListener('change', validateGuestNumberInput);
buttonGuestNumber.addEventListener('click', checkGuestNumber);
restartGuestNumberButton.addEventListener('click', restartGuestNumberGame);

function validateGuestNumberInput() {
    const value = inputGuestNumber.value.trim();
    if (value === '') {
        resultGuestNumber.textContent = 'Пожалуйста, введите число от 0 до 100.';
        inputIsValid = false;
    } else if (isNaN(value)) {
        resultGuestNumber.textContent = 'Пожалуйста, введите число от 0 до 100.';
        inputIsValid = false;
    } else if (value < 0){
        inputGuestNumber.value = 0;
        resultGuestNumber.textContent = 'Число не может быть меньше 0. Установлено значение 0.';
        inputIsValid = true;
    } else if (value > 100) {
        inputGuestNumber.value = 100;
        resultGuestNumber.textContent = 'Число не может быть больше 100. Установлено значение 100.';
        inputIsValid = true;
    } else {
        resultGuestNumber.textContent = '';
        inputIsValid = true;
    }
}

function checkGuestNumber() {
    const guess = Number(inputGuestNumber.value);
    if (remainingTries <= 0 && guess !== randomNumber) {
        resultGuestNumber.textContent = 'Игра окончена! Вы не угадали число. Загаданное число было: ' + randomNumber + '.';
        return;
    }
    if (!inputIsValid) {
        resultGuestNumber.textContent = 'Пожалуйста, введите число от 0 до 100.';
        return;
    } else {
        switch (true) {
            case guess < randomNumber:
                resultGuestNumber.textContent = 'Загаданное число больше.';
                remainingTries--;
                triesCount.textContent = 'У вас осталось ' + remainingTries + ' попыток';
                break;
            case guess > randomNumber:
                resultGuestNumber.textContent = 'Загаданное число меньше.';
                remainingTries--;
                triesCount.textContent = 'У вас осталось ' + remainingTries + ' попыток';
                break;
            case guess === randomNumber:
                resultGuestNumber.textContent = 'Поздравляем! Вы угадали число.';
                break;
        }
    }

}

function restartGuestNumberGame() {
    remainingTries = 7;
    randomNumber = Math.floor(Math.random() * 101);
    inputGuestNumber.value = '';
    resultGuestNumber.textContent = 'Игра перезапущена! Введите новое число от 0 до 100.';
    triesCount.textContent = 'У вас есть 7 попыток';
}