// Fechar modal ao clicar no X ou fora dele
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    // Abrir modal
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projeto = button.closest('.projeto-card');
            const titulo = projeto.querySelector('h3').textContent;
            const descricao = projeto.querySelector('p').textContent;
            const imagem = projeto.querySelector('img').src;
            const githubUrl = button.getAttribute('data-github');

            document.getElementById('modal-titulo').textContent = titulo;
            document.getElementById('modal-descricao').textContent = descricao;
            document.getElementById('modal-imagem').src = imagem;
            document.getElementById('modal-github').href = githubUrl;
            
            modal.style.display = 'block';
        });
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
// Modo Noturno
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Troca o ícone
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Salva preferência
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Carrega tema salvo
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}