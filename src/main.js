import Swiper from 'swiper';
import 'swiper/css';

const burgerMenu = document.querySelector('.header-burger'),
      nav = document.querySelector('.header-nav'),
      popularMedia = document.querySelector('.popular-media'),
      popularItem = document.querySelectorAll('.popular-item'),
      blogMedia = document.querySelector('.blog-media'),
      newsItem = document.querySelectorAll('.news-item'),
      reportItem = document.querySelectorAll('.report-img-container'),
      modalSelector = document.querySelector('.modal');

// SWIPER

window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        newsItem.forEach(item => {
            item.classList.add('swiper-slide');
        })
        popularItem.forEach(item => {
            item.classList.add('swiper-slide');
        });
        reportItem.forEach(item => {
            item.classList.add('swiper-slide');
        })

        popularMedia.style.gap = '0';
        blogMedia.style.gap = '0';

        document.querySelectorAll('.swiper-slide').forEach(item => item.style.overflow = 'hidden');

        const swiper = new Swiper('.swiper', {
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            spaceBetween: 20,
            slidesPerView: 'auto'
        });
    } else {
        popularMedia.style.gap = '20px';
        newsItem.forEach(item => {
            item.classList.remove('swiper-slide');
        })
        popularItem.forEach(item => {
            item.classList.remove('swiper-slide');
        });
        reportItem.forEach(item => {
            item.classList.remove('swiper-slide');
        })
    }
});

// BURGER MENU

burgerMenu.addEventListener('click', toggleBurger);

function toggleBurger(e) {
    e.preventDefault();
    const img = document.querySelector('.header-burger img');
    console.log(img);
    if (img.id === 'burger-icon') {
        img.id = '';
        img.src = 'img/burger-menu-open.svg'
    } else {
        img.id = 'burger-icon';
        img.src = 'img/burger-menu-close.svg'
    }

    nav.classList.toggle('header-nav-active');
    burgerMenu.classList.toggle('header-burger-active');
    document.querySelector('.body').classList.toggle('dis-scroll');
}

// MODAL

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector) {
    const modal = document.querySelector(modalSelector),
          modalOpen = document.querySelectorAll(triggerSelector);

    modalOpen.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    })

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

modal('[data-open]', '.modal');

// DROPDOWN

const dropdowns = document.querySelectorAll('.header-dropdown');

function closeDropdown() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        dropdownMenu.classList.remove('menu-open');
    });
}

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const options = dropdown.querySelectorAll('.dropdown-menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        closeDropdown();
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        dropdownMenu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            dropdownMenu.classList.remove('menu-open');
            options.forEach(option => {
                option.classList.remove('active');
            });
            option.classList.add('active');
        })
    })
})

// POST DB.JSON

async function postData(url, data) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.parse(data))
        });

        return await res.json();
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        throw error;
    }
};

function forms(formSelector) {
    const forms = document.querySelectorAll(formSelector)
    
    const message = {
        success: "Спасибо! Мы свяжемся с вами в течении 24-х часов!",
        failure: "Что-то пошло не так"
    }

    forms.forEach(form => {
        bindPostData(form);
    })

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
    
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/data', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }
}

forms('#data');

// VIDEO MODAL

const openModalBtn = document.querySelector('.about-play-btn');
const modalVideo = document.getElementById('videoModal');
const closeModalBtn = document.querySelector('.close-video');
const youtubeVideo = document.getElementById('youtubeVideo');
const videoURL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; 

openModalBtn.addEventListener('click', function() {
    youtubeVideo.src = videoURL;
    modalVideo.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModalBtn.addEventListener('click', function() {
    youtubeVideo.src = '';
    modalVideo.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', function(e) {
    if (e.target === modalVideo) {
        modalVideo.style.display = 'none';
        youtubeVideo.src = '';
        document.body.style.overflow = '';
    }
});

// PHOTO MODAL

const modalImg = document.getElementById('photoModal');
const modalImgContainer = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-img');

    document.querySelectorAll('.report-img-overlay').forEach(btn => {
        btn.addEventListener('click', function () {
            modalImg.style.display = 'block';
            modalImgContainer.src = this.dataset.src;
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', function () {
        modalImg.style.display = 'none';
        modalImgContainer.src = '';
        document.body.style.overflow = '';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modalImg) {
            modalImg.style.display = 'none';
            modalImgContainer.src = '';
            document.body.style.overflow = '';
        }
    });