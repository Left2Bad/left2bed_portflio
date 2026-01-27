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

// Carousel/Scroller для проектов
const scrollerContainer = document.querySelector('.scroller-container');
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
