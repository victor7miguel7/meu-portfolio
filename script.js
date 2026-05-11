document.addEventListener('DOMContentLoaded', () => {

    /* ===========================
       TEMA (DARK / LIGHT)
    =========================== */
    const themeBtn = document.getElementById('themeBtn');

    function applyTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        const icon = themeBtn.querySelector('i');
        icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Carrega preferência salva
    applyTheme(localStorage.getItem('theme') === 'dark');

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });


    /* ===========================
       MODAL
    =========================== */
    const modal      = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    function openModal(card, githubUrl) {
        const titulo   = card.querySelector('h3').textContent;
        const descricao = card.querySelector('p').textContent;
        const imagem   = card.querySelector('img').src;

        document.getElementById('modal-titulo').textContent    = titulo;
        document.getElementById('modal-descricao').textContent = descricao;
        document.getElementById('modal-imagem').src            = imagem;
        document.getElementById('modal-imagem').alt            = titulo;
        document.getElementById('modal-github').href           = githubUrl;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Delegação de eventos nos botões dos cards
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.card-link.btn');
        if (btn) {
            e.preventDefault();
            const card = btn.closest('.projeto-card');
            openModal(card, btn.getAttribute('data-github'));
        }
    });

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    /* ===========================
       CARROSSEL
    =========================== */
    const track    = document.getElementById('carouselTrack');
    const viewport = document.getElementById('carouselViewport');
    const prevBtn  = document.getElementById('prevBtn');
    const nextBtn  = document.getElementById('nextBtn');
    const dotsWrap = document.getElementById('carouselDots');
    const counterCurrent = document.getElementById('currentSlide');
    const counterTotal   = document.getElementById('totalSlides');

    const cards = Array.from(track.querySelectorAll('.projeto-card'));

    // Quantos cards visíveis por vez (responsivo)
    function visibleCount() {
        const w = viewport.clientWidth;
        if (w < 600) return 1;
        if (w < 900) return 2;
        return 3;
    }

    let current = 0; // índice do primeiro card visível

    function totalPages() {
        return Math.ceil(cards.length / visibleCount());
    }

    function cardWidth() {
        // largura de um card + gap (1.5rem = 24px)
        return cards[0].offsetWidth + 24;
    }

    function goTo(page) {
        const pages = totalPages();
        current = Math.max(0, Math.min(page, pages - 1));

        const offset = current * visibleCount() * cardWidth();
        track.style.transform = `translateX(-${offset}px)`;

        // Botões
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= pages - 1;

        // Dots
        document.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        // Contador (mostra o índice do primeiro card visível)
        const firstVisible = current * visibleCount() + 1;
        counterCurrent.textContent = firstVisible;
    }

    function buildDots() {
        dotsWrap.innerHTML = '';
        const pages = totalPages();
        counterTotal.textContent = cards.length;

        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Página ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }
    }

    function init() {
        buildDots();
        goTo(0);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Recalcula ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildDots();
            goTo(Math.min(current, totalPages() - 1));
        }, 150);
    });

    // Swipe touch
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    init();
});