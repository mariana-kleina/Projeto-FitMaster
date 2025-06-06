document.addEventListener('DOMContentLoaded', () => {
    carregarPlanosParaSelect();
    carregarAlunos();
    carregarAgendamentos();
    carregarPlanosLista(); 
    carregarPresencas();

    document.getElementById('form-aluno').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('aluno-id').value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const plano_id = document.getElementById('plano').value;

        const url = id ? `http://localhost:3001/alunos/${id}` : 'http://localhost:3001/alunos';
        const metodo = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, plano_id })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.mensagem);
        } else {
            alert('Erro: ' + (data.erro || 'Ocorreu um erro desconhecido.'));
        }

        document.getElementById('form-aluno').reset();
        document.getElementById('aluno-id').value = '';
        carregarAlunos();
        carregarPlanosParaSelect();
    });

    document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
        e.preventDefault();
        const aluno_id = document.getElementById('aluno_id').value;
        const data = document.getElementById('data_agendamento').value; 
        const hora = document.getElementById('hora_agendamento').value; 
        const atividade = document.getElementById('atividade_agendamento').value; 
        const data_hora = `${data} ${hora}:00`; 

        const response = await fetch('http://localhost:3001/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aluno_id, data_hora, atividade }) // Usa data_hora consistente com o banco
        });
        const dataResponse = await response.json();
        if (response.ok) {
            alert(dataResponse.mensagem);
        } else {
            alert('Erro: ' + (dataResponse.erro || 'Ocorreu um erro desconhecido.'));
        }

        document.getElementById('form-agendamento').reset();
        carregarAgendamentos();
    });

    document.getElementById('form-plano').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('plano-id').value;
        const nome = document.getElementById('nome_plano').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const duracao_meses = parseInt(document.getElementById('duracao_meses').value);

        const url = id ? `http://localhost:3001/planos/${id}` : 'http://localhost:3001/planos';
        const metodo = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, duracao_meses })
        });
        const dataResponse = await response.json();
        if (response.ok) {
            alert(dataResponse.mensagem);
        } else {
            alert('Erro: ' + (dataResponse.erro || 'Ocorreu um erro desconhecido.'));
        }

        document.getElementById('form-plano').reset();
        document.getElementById('plano-id').value = '';
        carregarPlanosLista();
        carregarPlanosParaSelect();
    });

    document.getElementById('form-presenca').addEventListener('submit', async (e) => {
        e.preventDefault();
        const aluno_id = document.getElementById('aluno_id_presenca').value;
        const data_presenca = document.getElementById('data_presenca').value;

        const response = await fetch('http://localhost:3001/presencas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aluno_id, data_presenca })
        });
        const dataResponse = await response.json();
        if (response.ok) {
            alert(dataResponse.mensagem);
        } else {
            alert('Erro: ' + (dataResponse.erro || 'Ocorreu um erro desconhecido.'));
        }

        document.getElementById('form-presenca').reset();
        carregarPresencas();
    });
});


async function carregarPlanosParaSelect() {
    try {
        const response = await fetch('http://localhost:3001/planos');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }
        const planos = await response.json();
        const select = document.getElementById('plano');
        select.innerHTML = '<option value="">Selecione um plano</option>';
        planos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar planos para o select:', error);
    }
}

async function carregarAlunos() {
    const res = await fetch('http://localhost:3001/alunos');
    const alunos = await res.json();
    const lista = document.getElementById('lista-alunos');
    lista.innerHTML = '';

    if (alunos.length === 0) {
        lista.innerHTML = '<li class="p-2 text-gray-500">Nenhum aluno cadastrado.</li>';
        return;
    }

    alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.className = 'border-b p-2 flex justify-between items-center';
        li.innerHTML = `
            <span>ID: ${aluno.id} - ${aluno.nome} (${aluno.email}) - Plano: ${aluno.plano_nome || 'N/A'}</span>
            <div>
                <button onclick="editarAluno(${aluno.id}, '${aluno.nome}', '${aluno.email}', ${aluno.plano_id})" class="text-blue-500 mr-2">Editar</button>
                <button onclick="excluirAluno(${aluno.id})" class="text-red-500">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

async function carregarAgendamentos() {
    try {
        const res = await fetch('http://localhost:3001/agendamentos');
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status} ${res.statusText}`);
        }
        const agendamentos = await res.json();
        const lista = document.getElementById('lista-agendamentos');
        lista.innerHTML = '';

        if (agendamentos.length === 0) {
            lista.innerHTML = '<li class="p-2 text-gray-500">Nenhum agendamento cadastrado.</li>';
            return;
        }

        agendamentos.forEach(agendamento => {
            const li = document.createElement('li');
            li.className = 'border-b p-2 flex justify-between items-center';
                const dataHoraFormatada = new Date(agendamento.data_hora).toLocaleString('pt-BR', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            li.innerHTML = `
                <span>ID Aluno: ${agendamento.aluno_id} - ${agendamento.aluno_nome || 'N/A'} - Data/Hora: ${dataHoraFormatada} - Atividade: ${agendamento.atividade}</span>
                <div>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Erro na função carregarAgendamentos:', error);
        document.getElementById('lista-agendamentos').innerHTML = `<li class="p-2 text-red-500">Erro ao carregar agendamentos: ${error.message}</li>`;
    }
}

async function carregarPlanosLista() {
    try {
        const res = await fetch('http://localhost:3001/planos');
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ao buscar planos: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const planos = await res.json();
        const lista = document.getElementById('lista-planos');
        lista.innerHTML = '';

        if (planos.length === 0) {
            lista.innerHTML = '<li class="p-2 text-gray-500">Nenhum plano cadastrado.</li>';
            return;
        }

        planos.forEach(plano => {
            const li = document.createElement('li');
            li.className = 'border-b p-2 flex justify-between items-center';
            li.innerHTML = `
                <span>${plano.nome} - R$ ${plano.preco.toFixed(2)} (${plano.duracao_meses} meses)</span>
                <div>
                    <button onclick="editarPlano(${plano.id}, '${plano.nome}', ${plano.preco}, ${plano.duracao_meses})" class="text-blue-500 mr-2">Editar</button>
                    <button onclick="excluirPlano(${plano.id})" class="text-red-500">Excluir</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Erro na função carregarPlanosLista:', error);
        document.getElementById('lista-planos').innerHTML = `<li class="p-2 text-red-500">Erro ao carregar planos: ${error.message}</li>`;
    }
}


async function carregarPresencas() {
    const res = await fetch('http://localhost:3001/presencas');
    const presencas = await res.json();
    const lista = document.getElementById('lista-presencas');
    lista.innerHTML = '';

    if (presencas.length === 0) {
        lista.innerHTML = '<li class="p-2 text-gray-500">Nenhuma presença registrada.</li>';
        return;
    }

    presencas.forEach(presenca => {
        const li = document.createElement('li');
        li.className = 'border-b p-2 flex justify-between items-center';
        const dataFormatada = new Date(presenca.data_presenca).toLocaleDateString('pt-BR');
        li.innerHTML = `
            <span>ID Aluno: ${presenca.aluno_id} - Data: ${dataFormatada}</span>
            <div>
            </div>
        `;
        lista.appendChild(li);
    });
}

function editarAluno(id, nome, email, plano_id) {
    document.getElementById('aluno-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('plano').value = plano_id;
}

async function excluirAluno(id) {
    if (confirm('Deseja excluir este aluno?')) {
        const response = await fetch(`http://localhost:3001/alunos/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            alert(data.mensagem);
        } else {
            alert('Erro: ' + (data.erro || 'Ocorreu um erro desconhecido.'));
        }
        carregarAlunos();
    }
}

function editarPlano(id, nome, preco, duracao_meses) {
    document.getElementById('plano-id').value = id;
    document.getElementById('nome_plano').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('duracao_meses').value = duracao_meses;
}

async function excluirPlano(id) {
    if (confirm('Deseja excluir este plano? Todos os alunos associados precisarão ter seu plano atualizado.')) {
        const response = await fetch(`http://localhost:3001/planos/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            alert(data.mensagem);
        } else {
            alert('Erro: ' + (data.erro || 'Ocorreu um erro desconhecido.'));
        }
        carregarPlanosLista(); 
        carregarPlanosParaSelect(); 
        carregarAlunos();
    }
}

function exibirSecao(secao) {
    document.querySelectorAll('section').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.getElementById(secao).classList.add('active');
    document.getElementById(secao).classList.remove('hidden');

    if (secao === 'alunos') {
        carregarAlunos();
        carregarPlanosParaSelect();
    } else if (secao === 'agendamentos') {
        carregarAgendamentos();
    } else if (secao === 'planos') {
        carregarPlanosLista();
    } else if (secao === 'presencas') {
        carregarPresencas();
    }
}