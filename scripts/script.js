const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const contentLogin = document.getElementById('contentLogin');
const userId = localStorage.getItem('user_id');

window.onload = () => {
    if (userId) {
        contentLogin.style.display = 'none';
    } else {
        contentLogin.classList.remove('hidden');
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputLogin = document.getElementById('inputLogin').value;
    const inputPassword = document.getElementById('inputPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: inputLogin,
            password: inputPassword
        })
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();

                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('user_name', data.user.name);

                loginMessage.textContent = 'Login realizado!';
                loginMessage.className = 'success';

                setTimeout(() => {
                    contentLogin.style.display = 'none';
                }, 700);

            } else {
                loginMessage.textContent = 'Login inválido. Verifique suas credenciais.';
                loginMessage.className = 'error';
            }
        })
        .catch((err) => {
            loginMessage.textContent = 'Não foi possivel realizar o login.';
            loginMessage.className = 'error';
            console.error('Erro no login:', err);
        });
});


function logout() {
    localStorage.clear();
    location.reload();
    contentLogin.style.display = 'block';
}

/* Icon menu */
const openMenuBtn = document.getElementById('openIcon');
const closeMenuBtn = document.getElementById('closeIcon');
const menuList = document.getElementById('menuList');

openMenuBtn.addEventListener('click', function () {
    openMenuBtn.classList.add('hidden');
    closeMenuBtn.classList.remove('hidden');
    menuList.classList.remove('hidden');
});

closeMenuBtn.addEventListener('click', function () {
    closeMenuBtn.classList.add('hidden');
    openMenuBtn.classList.remove('hidden');
    menuList.classList.add('hidden');
});

if (userId) {
    const linksInternal = document.querySelectorAll('.links');
    linksInternal.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const linkHref = link.getAttribute('href');

            location.hash = linkHref;

            if (!menuList.classList.contains('hidden')) {
                closeMenuBtn.classList.add('hidden');
                openMenuBtn.classList.remove('hidden');
                menuList.classList.add('hidden');
            }
        })
    });

    function RenderPage() {

        const hash = window.location.hash;
        
        const homeContent = document.getElementById('home');

        homeContent.classList.add('hidden');

        switch (hash) {
            case '#home':
                homeContent.classList.remove('hidden');
                break;
            default:
                homeContent.classList.remove('hidden');
                break;
        }

    }

    window.addEventListener('DOMContentLoaded', RenderPage);
    window.addEventListener('hashchange', RenderPage);

    window.addEventListener('popstate', () => {
        RenderPage();
    });
}