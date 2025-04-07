const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const contentLogin = document.getElementById('contentLogin');
const userId = localStorage.getItem('user_id');
const userData = JSON.parse(localStorage.getItem('user'));

/* Verificação se o usuário está logado */
window.onload = () => {
    if (!userId || !userData) {
        localStorage.clear();
        contentLogin.classList.remove('hidden');
        return;
    }

    contentLogin.classList.add('hidden');

    if (userData.isrecruiter) {
        createdLiRecruiter();
        loadAllCurriculos();
    }
};


/* Requisição de cadastro */
const registerContainer = document.getElementById('registerContainer');
function returnToRegister() {
    registerContainer.classList.add('active');
}

function returnToLogin() {
    registerContainer.classList.remove('active');
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputRegisterName = document.getElementById('inputRegisterName').value;
    const inputRegisterEmail = document.getElementById('inputRegisterEmail').value;
    const inputRegisterPassword = document.getElementById('inputRegisterPassword').value;
    const inputRegisterPasswordConfirm = document.getElementById('inputRegisterPasswordConfirm').value;
    const inputRegisterIsRecruiter = document.getElementById('inputRegisterIsRecruiter').value;

    if (inputRegisterPassword !== inputRegisterPasswordConfirm) {
        registerMessage.textContent = 'As senhas não são iguais!';
        registerMessage.className = 'error';
        return;
    }

    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: inputRegisterName,
            email: inputRegisterEmail,
            password: inputRegisterPassword,
            isrecruiter: inputRegisterIsRecruiter
        })
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();

                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('user', JSON.stringify(data.user));

                registerMessage.textContent = 'Cadastro realizado!';
                registerMessage.className = 'success';

                if (data.user.isrecruiter) {
                    createdLiRecruiter();
                }

                setTimeout(() => {
                    contentLogin.style.display = 'none';
                }, 700);

            } else {
                registerMessage.textContent = 'Nao foi possivel realizar o cadastro';
                registerMessage.className = 'error';
            }
        })
        .catch((err) => {
            console.error('Erro no cadastro:', err);
            if (err.status === 409) {
                registerMessage.textContent = 'Email já cadastrado!';
                registerMessage.className = 'error';
                return;
            }
            registerMessage.textContent = 'Nao foi possivel realizar o cadastro';
            registerMessage.className = 'error';
        })
})


/* Requeisição de login */
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
                localStorage.setItem('user', JSON.stringify(data.user));

                loginMessage.textContent = 'Login realizado!';
                loginMessage.className = 'success';

                if (data.user.isrecruiter) {
                    createdLiRecruiter();
                }

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


/* Deslogar */
function logout() {
    localStorage.clear();
    location.reload();
    contentLogin.style.display = 'block';
}


/* Criar o link de recrutador no header */
function createdLiRecruiter() {
    const recruiterOn = document.getElementById('recruiterOn');

    if (userData && userData.isrecruiter) {
        const createdTagA = document.createElement('a');
        
        createdTagA.href = '#recrutador';
        createdTagA.classList.add('links');
        createdTagA.id = 'recruiterLink';
        createdTagA.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                stroke-linecap="round" stroke-linejoin="round" 
                class="lucide lucide-inbox-icon lucide-inbox">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
            <p>Todos os Currículos</p>
        `;
        
        createdTagA.addEventListener('click', async () => {
            await loadAllCurriculos();
            RenderPage();
        });

        recruiterOn.appendChild(createdTagA);
        recruiterOn.classList.remove('hidden');
    }
}


/* Menu do header de navegação */
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


/*  Navegação interna */
if (userId) {
    const linksInternal = document.querySelectorAll('.links');
    linksInternal.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const linkHref = link.getAttribute('href');

            location.hash = linkHref;
        })
    });

    /* Renderização de página */
    function RenderPage() {

        const hash = window.location.hash;

        const curriculoFormContent = document.getElementById('contentCurriculos');
        const homeContent = document.getElementById('home');
        const contentInfo = document.getElementById('contentInfo');
        const contentRecruiters = document.getElementById('contentRecruiters');

        curriculoFormContent.classList.add('hidden');
        homeContent.classList.add('hidden');
        contentInfo.classList.add('hidden');
        contentRecruiters.classList.add('hidden');

        if (!menuList.classList.contains('hidden')) {
            closeMenuBtn.classList.add('hidden');
            openMenuBtn.classList.remove('hidden');
            menuList.classList.add('hidden');
        }

        switch (hash) {
            case '#home':
                homeContent.classList.remove('hidden');
                break;
            case '#curriculos':
                curriculoFormContent.classList.remove('hidden');
                break;
            case '#informacoes':
                contentInfo.classList.remove('hidden');
                break;
            case '#recrutador':
                contentRecruiters.classList.remove('hidden');
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

/* Formatação de CPF */
const inputCpf = document.getElementById('inputCpf');
inputCpf.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.value = value;
});

/* Formatação de data */
const inputDataNasc = document.getElementById('inputDataNasc');
inputDataNasc.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');

    if (value.length > 8) {
        value = value.slice(0, 8);
    }
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d{1,4})$/, '$1$2');

    this.value = value;
});

/* Formatação da pretenção salarial */
const inputPretensao = document.getElementById('pretensao_salarial');
inputPretensao.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');

    value = value.substring(0, 10);

    value = (Number(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    this.value = value;
});


/* Requisição criar curriculo */
const curriculoForm = document.getElementById('curriculoForm');

curriculoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!userId) return;

    const inputCurriculoMsg = document.getElementById('curriculoMsg');
    curriculoForm.classList.remove('hidden');

    const cpfClean = inputCpf.value.replace(/\D/g, '');
    const [day, month, year] = inputDataNasc.value.split('/');
    const dataNascFormat = `${year}-${month}-${day}`;
    const salarioClean = inputPretensao.value.replace(/\D/g, '').replace(/^0+/, '');
    const salarioFormat = (Number(salarioClean) / 100).toFixed(2);

    const dataForm = {
        name: document.getElementById('inputName').value,
        email: document.getElementById('inputEmail').value,
        cpf: cpfClean,
        dataNasc: dataNascFormat,
        sexo: document.getElementById('sexo').value,
        estadocivil: document.getElementById('inputEstadocivil').value,
        escolaridade: document.getElementById('inputEscolaridade').value,
        cursos: document.getElementById('cursos').value,
        experiencia: document.getElementById('experiencia').value,
        pretensao_salarial: salarioFormat,
        user_id: userId
    };

    const isEditing = curriculoForm.dataset.curriculoId;
    const url = isEditing ? `http://localhost:3000/curriculos/${isEditing}` : 'http://localhost:3000/curriculos';
    const methodRequest = isEditing ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: methodRequest,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataForm)
        });

        if (response.status === 200) {
            inputCurriculoMsg.textContent = isEditing
                ? 'Currículo atualizado com sucesso!'
                : 'Currículo criado com sucesso!'
            ;
            inputCurriculoMsg.className = 'success';

            if (!isEditing) {
                curriculoForm.reset();
            }

            delete curriculoForm.dataset.curriculoId;

            setTimeout(() => {
                inputCurriculoMsg.textContent = '';
                inputCurriculoMsg.className = '';
            }, 2000);
        } else {
            inputCurriculoMsg.textContent = 'Não foi possível criar o curriculo!';
            inputCurriculoMsg.className = 'error';
        }
    } catch (err) {
        console.log(err);
        inputCurriculoMsg.textContent = 'Não foi possível criar o curriculo!';
        inputCurriculoMsg.className = 'error';
    }
});

/* Abertura do form de curriculo */
const mainBtn = document.querySelectorAll('.mainBtn');
const returnBtn = document.getElementById('returnBtn');
const updateCurriculoText = document.getElementById('updateCurriculoText');
const registerCurriculoText = document.getElementById('registerCurriculoText');
const curriculoList = document.getElementById('curriculoList');

const curriculoNotFound = document.getElementById('curriculoNotFound');
const curriculoName = document.getElementById('curriculoName');
const dateCreated = document.getElementById('dateCreated');
const curriculoItemTemplate = document.querySelector('.content-curriculos #curriculoItemTemplate');

function openRegisterCurriculo() {
    curriculoList.classList.add('hidden');

    mainBtn.forEach(btn => {
        btn.classList.add('hidden');
    });

    returnBtn.classList.remove('hidden');

    updateCurriculoText.classList.add('hidden');

    if (registerCurriculoText.classList.contains('hidden')) {
        registerCurriculoText.classList.remove('hidden');
    }

    curriculoForm.reset();
    curriculoForm.classList.remove('hidden');
}


/* Retornar para a tela de curriculos */
function returnToCurriculoList() {
    mainBtn.forEach(btn => {
        btn.classList.remove('hidden');
    });

    registerCurriculoText.classList.add('hidden');
    updateCurriculoText.classList.add('hidden');

    returnBtn.classList.add('hidden');

    curriculoForm.classList.add('hidden');
    curriculoNotFound.classList.add('hidden');

    curriculoList.innerHTML = '';
    curriculoList.classList.remove('hidden');

    location.hash = '#curriculos';
    RenderPage();
}

/* Requisição listar curriculos do usuario */
async function openUpdateCurriculo() {
    mainBtn.forEach(btn => {
        btn.classList.add('hidden');
    });

    registerCurriculoText.classList.add('hidden');
    updateCurriculoText.classList.remove('hidden');
    returnBtn.classList.remove('hidden');

    try {
        const response = await fetch(`http://localhost:3000/users/${userId}/curriculos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const curriculosData = await response.json();

        const curriculos = curriculosData.curriculos;

        if (curriculos.length > 0) {
            
            curriculoList.innerHTML = '';
            curriculoList.classList.remove('hidden');
            
            curriculosData.forEach(item => {
                const template = curriculoItemTemplate.content.cloneNode(true);
                const curriculoItem = template.querySelector('.curriculo-item');
                
                curriculoItem.classList.remove('hidden');
                curriculoItem.classList.remove('hidden');
                curriculoItem.removeAttribute('id');

                const dateFormatted = formatarData(item.created_at.split('T')[0]);

                curriculoItem.querySelector('.curriculoName').textContent = `Nome: ${item.name}`;
                curriculoItem.querySelector('.curriculoDate').textContent = `Criado em: ${dateFormatted}`;

                const editCurriculoBtn = curriculoItem.querySelector('.editCurriculoBtn');
                editCurriculoBtn.addEventListener('click', () => {
                    formChangeCurriculo(item);
                });

                const deleteCurriculoBtn = curriculoItem.querySelector('.deleteCurriculoBtn');
                deleteCurriculoBtn.addEventListener('click', () => {
                    deleteCurriculo(item.id);
                });

                curriculoList.appendChild(template);
            });

        } else {
            updateCurriculoText.classList.add('hidden');
            curriculoList.classList.remove('hidden');
            curriculoNotFound.classList.remove('hidden');
        }

    } catch (err) {
        console.log(err);
        curriculoNotFound.classList.remove('hidden');
    }
}

/*  Requisição deletar curriculo */
function deleteCurriculo(id) {
    fetch(`http://localhost:3000/curriculos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        window.location.reload();
        curriculoList.classList.remove('hidden');
    });
}

/* Formatação do form de curriculo para edição */
function formChangeCurriculo(item) {
    curriculoForm.reset();
    curriculoForm.dataset.curriculoId = item.id;

    curriculoList.classList.add('hidden');
    updateCurriculoText.classList.add('hidden');
    curriculoForm.classList.remove('hidden');

    document.getElementById('inputName').value = item.name;
    document.getElementById('inputEmail').value = item.email;
    document.getElementById('sexo').value = item.sexo;
    document.getElementById('inputEstadocivil').value = item.estadocivil;
    document.getElementById('inputEscolaridade').value = item.escolaridade;
    document.getElementById('cursos').value = item.cursos;
    document.getElementById('experiencia').value = item.experiencia;

    const cpfFormatted = formatarCPF(item.cpf);
    document.getElementById('inputCpf').value = cpfFormatted;

    const [year, month, day] = item.dataNasc.split('T')[0].split('-');
    document.getElementById('inputDataNasc').value = `${day}/${month}/${year}`;

    const salarioFormatted = (parseFloat(item.pretensao_salarial)).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    document.getElementById('pretensao_salarial').value = salarioFormatted;
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

/* Tela de edição da conta */
const deleteAccountModalContent = document.getElementById('deleteAccountModal');
function deleteAccountModal() {
    deleteAccountModalContent.classList.remove('hidden');
}

function closeDeleteAccountModal() {
    deleteAccountModalContent.classList.add('hidden');
}

const deleteAccountConfirm = document.getElementById('deleteAccountConfirm');

deleteAccountConfirm.addEventListener('click', () => {

    const msgDelete = document.getElementById('msgDelete');

    fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        if (res.status === 200) {
            msgDelete.classList.remove('hidden');
            msgDelete.textContent = 'Conta deletada com sucesso!';
            msgDelete.className = 'success';

            setTimeout(() => {
                deleteAccountModalContent.classList.add('hidden');
                closeDeleteAccountModal();
                logout();
            }, 600);

        } else {
            msgDelete.classList.remove('hidden');
            msgDelete.textContent = 'Não foi possível deletar a conta!';
            msgDelete.className = 'error';
        }
    })
    .catch((err) => {
        console.error('Erro ao deletar conta:', err);
        msgDelete.classList.remove('hidden');
        msgDelete.textContent = 'Não foi possível deletar a conta!';
        msgDelete.className = 'error';
    });
});

const inputInfoName = document.getElementById('inputInfoName');
const inputInfoEmail = document.getElementById('inputInfoEmail');
const inputInfoPassword = document.getElementById('inputInfoPassword');

const updateInfo = document.getElementById('updateInfo');
const infoMessage = document.getElementById('infoMessage');
const coolinputs = document.querySelectorAll('#formInfo .coolinput');

function loadUserInfo() {
    if (!userData) return;

    inputInfoName.value = userData.name;
    inputInfoEmail.value = userData.email;
    inputInfoPassword.value = userData.password;
}

loadUserInfo();

function editDataUser() {
    const isEditing = updateInfo.textContent === 'Salvar';

    if (!isEditing) {
        coolinputs.forEach(input => {
            input.classList.remove('inputReadonly');
        });

        updateInfo.textContent = 'Salvar';

        inputInfoName.removeAttribute('readonly');
        inputInfoEmail.removeAttribute('readonly');
        inputInfoPassword.removeAttribute('readonly');

        inputInfoName.focus();
    } else {
        const updateDataUser = {
            name: inputInfoName.value,
            email: inputInfoEmail.value,
            password: inputInfoPassword.value
        };

        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateDataUser)
        })
        .then(async (res) => {
            if (res.status === 200) {
                const updatedDataUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedDataUser));

                inputInfoName.setAttribute('readonly', true);
                inputInfoEmail.setAttribute('readonly', true);
                inputInfoPassword.setAttribute('readonly', true);

                coolinputs.forEach(input => input.classList.add('inputReadonly'));
                updateInfo.textContent = 'Editar Informações';

                infoMessage.textContent = 'Dados atualizados com sucesso!';
                infoMessage.className = 'success';

                setTimeout(() => {
                    infoMessage.textContent = '';
                    infoMessage.className = '';
                }, 1000);
            } else {
                infoMessage.textContent = 'Não foi possível atualizar os dados!';
                infoMessage.className = 'error';
            }
        })
        .catch((err) => {
            console.error('Erro ao atualizar dados:', err);
            infoMessage.textContent = 'Não foi possível atualizar os dados!';
            infoMessage.className = 'error';
        });
    }
}


/* tela dos recrutadores */
async function loadAllCurriculos() {
    
    const recruitersList = document.getElementById('recruitersList');
    recruitersList.innerHTML = '';

    const template = document.querySelector('.recruiters-list #curriculoItemTemplate');
    
    const recusedCurriculos = JSON.parse(localStorage.getItem('recusedCurriculos')) || [];

    try {
        const response = await fetch('http://localhost:3000/curriculos');
        const data = await response.json();

        const curriculos = data.curriculos;

        if (!curriculos.length) {
            recruitersList.innerHTML = '<p>Nenhum currículo encontrado.</p>';
            return;
        }

        const totalSalarial = curriculos.reduce((acc, curriculo) => {
            return acc + parseFloat(curriculo.pretensao_salarial);
        }, 0);
        const mediaSalarial = (totalSalarial / curriculos.length);

        curriculos.forEach(item => {
            const itemTemplate = template.content.cloneNode(true);
            const curriculoItem = itemTemplate.querySelector('.curriculo-item');

            const curriculoName = itemTemplate.querySelector('.curriculoName');
            const curriculoDate = itemTemplate.querySelector('.curriculoDate');
            const curriculoPretencao = itemTemplate.querySelector('.curriculoPretencao');
            const recuserBtn = itemTemplate.querySelector('.recuserBtn');
            const seeDetailsBtn = itemTemplate.querySelector('.seeDetailsCurriculoBtn');

            curriculoName.textContent = `Nome: ${item.name}`;
            curriculoDate.textContent = `Criado em: ${formatarData(item.created_at.split('T')[0])}`;
            curriculoPretencao.textContent = `Pretensão salarial: ${parseFloat(item.pretensao_salarial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

            if(recusedCurriculos.includes(item.id)) {
                curriculoItem.classList.add('recused');
                recuserBtn.textContent = 'Desmarcar';
            }

            const pretensaoSalario = parseFloat(item.pretensao_salarial);

            if (pretensaoSalario > mediaSalarial) {
                curriculoPretencao.style.color = 'blue';
            } else if (pretensaoSalario < mediaSalarial) {
                curriculoPretencao.style.color = 'green';
            }

            recuserBtn.addEventListener('click', () => {
                toggleRecused(item.id, curriculoItem, recuserBtn);
            });

            seeDetailsBtn.addEventListener('click', () => {
                seeResumeDetails(item);
            });

            recruitersList.appendChild(itemTemplate);
        });

        const mediaSummary = document.createElement('div');
        mediaSummary.classList.add('curriculo-item');
        mediaSummary.style.marginTop = '2rem';
        mediaSummary.innerHTML = `
            <div class="curriculo-item-header">
                <h3>Resumo dos salários</h3>
                <p>Total de pretensão salarial: <strong>${totalSalarial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                <p>Média de pretensão salarial: <strong>${mediaSalarial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
            </div>
        `;

        recruitersList.appendChild(mediaSummary);
    } catch(err) {
        console.error('Erro ao carregar currículos:', err);
        recruitersList.innerHTML = '<p>Erro ao carregar os currículos.</p>';
    }
}

/* Recusar/desmarcar currículo */
function toggleRecused(id, curriculoItem, recuserBtn) {
    let recusedCurriculos = JSON.parse(localStorage.getItem('recusedCurriculos')) || [];

    if(recusedCurriculos.includes(id)) {
        recusedCurriculos = recusedCurriculos.filter(itemId => itemId !== id);
        curriculoItem.classList.remove('recused');
        recuserBtn.textContent = 'Recusar';
    } else {
        recusedCurriculos.push(id);
        curriculoItem.classList.add('recused');
        recuserBtn.textContent = 'Desmarcar';
    }

    localStorage.setItem('recusedCurriculos', JSON.stringify(recusedCurriculos));
}

/* ver detalhes do currículo */
function seeResumeDetails(curriculo) {
    const recruitersContainer = document.querySelector('.recruiters-container');
    recruitersContainer.classList.add('hidden');

    const curriculoDetalhes = document.getElementById('curriculoDetalhes');
    const curriculoInfo = document.getElementById('curriculoInfo');
    const mainInfosHeader = document.getElementById('mainInfosHeader');

    const dataFormated = formatarData(curriculo.dataNasc.split('T')[0]);
    const salarioFormat = parseFloat(curriculo.pretensao_salarial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    mainInfosHeader.innerHTML = `
        <p>Currículo de ${curriculo.name}</p>
        <p><strong>Data de Criação:</strong> ${formatarData(curriculo.created_at.split('T')[0])}</p>
    `;  

    curriculoInfo.innerHTML = `
        <section class="dados-pessoais">
            <h4>Dados Pessoais</h4>
            <p><strong>Nome:</strong> ${curriculo.name}</p>
            <p><strong>Email:</strong> ${curriculo.email}</p>
            <p><strong>CPF:</strong> ${formatarCPF(curriculo.cpf)}</p>
            <p><strong>Data de Nascimento:</strong> ${dataFormated}</p>
            <p><strong>Sexo:</strong> ${curriculo.sexo}</p>
            <p><strong>Estado Civil:</strong> ${curriculo.estadocivil}</p>
        </section>

        <section class="formacao">
            <h4>Formação</h4>
            <p><strong>Escolaridade:</strong> ${curriculo.escolaridade}</p>
            <p><strong>Cursos / Especializações:</strong> ${curriculo.cursos}</p>
        </section>

        <section class="experiencia">
            <h4>Experiência Profissional</h4>
            <p>${curriculo.experiencia}</p>
        </section>

        <section class="pretensao">
            <h4>Pretensão Salarial</h4>
            <p>${salarioFormat}</p>
        </section>
    `;

    curriculoDetalhes.classList.remove('hidden');
}

function closeResumeDetails() {
    const curriculoDetalhes = document.getElementById('curriculoDetalhes');
    const recruitersContainer = document.querySelector('.recruiters-container');

    recruitersContainer.classList.remove('hidden');
    curriculoDetalhes.classList.add('hidden');
}