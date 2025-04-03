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
        
        const curriculoFormContent = document.getElementById('contentCurriculos');
        const homeContent = document.getElementById('home');

        curriculoFormContent.classList.add('hidden');
        homeContent.classList.add('hidden');

        switch (hash) {
            case '#home':
                homeContent.classList.remove('hidden');
                break;
            case '#curriculos':
                curriculoFormContent.classList.remove('hidden');
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

document.getElementById('curriculoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
        alert('CPF inválido!');
        return;
    }

    const dataBr = document.getElementById('dataNasc').value;
    const dataParts = dataBr.split('/');
    const dataFormatada = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;

    const body = {
        name: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        login: document.getElementById('loginCadastro').value,
        password: document.getElementById('senhaCadastro').value,
        cpf,
        dataNasc: dataFormatada,
        sexo: document.getElementById('sexo').value,
        estadocivil: document.getElementById('estadocivil').value,
        escolaridade: document.getElementById('escolaridade').value,
        cursos: document.getElementById('cursos').value,
        experiencia: document.getElementById('experiencia').value,
        pretensao_salarial: document.getElementById('pretensao_salarial').value
    };

    // TODO: Validar login duplicado no backend antes de cadastrar
    const res = await fetch('http://localhost:3000/curriculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const msg = document.getElementById('curriculoMsg');
    if (res.ok) {
        msg.textContent = 'Currículo salvo com sucesso!';
        msg.className = 'success';
    } else {
        msg.textContent = 'Erro ao salvar o currículo.';
        msg.className = 'error';
    }
});