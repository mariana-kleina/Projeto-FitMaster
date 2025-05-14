
// script.js - Funções para Alunos, Agendamentos, Planos e Presenças

// Funções para Alunos
async function carregarAlunos() {
  try {
    const resposta = await fetch('http://localhost:3000/alunos');
    const alunos = await resposta.json();

    const lista = document.getElementById('lista-alunos');
    lista.innerHTML = '';

    alunos.forEach(aluno => {
      const item = document.createElement('li');
      item.textContent = `${aluno.nome} (${aluno.email}) - Plano: ${aluno.plano}`;

      const botaoEditar = document.createElement('button');
      botaoEditar.textContent = 'Editar';
      botaoEditar.onclick = () => editarAluno(aluno);

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.onclick = () => excluirAluno(aluno.id);

      item.appendChild(botaoEditar);
      item.appendChild(botaoExcluir);
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error('Erro ao carregar alunos:', erro);
  }
}

// Funções para Agendamentos
async function carregarAgendamentos() {
  try {
    const resposta = await fetch('http://localhost:3000/agendamentos');
    const agendamentos = await resposta.json();

    const lista = document.getElementById('lista-agendamentos');
    lista.innerHTML = '';

    agendamentos.forEach(agendamento => {
      const item = document.createElement('li');
      item.textContent = `Aluno ID: ${agendamento.aluno_id} - Data: ${agendamento.data} - Hora: ${agendamento.hora} - Descrição: ${agendamento.descricao}`;

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.onclick = () => excluirAgendamento(agendamento.id);

      item.appendChild(botaoExcluir);
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);
  }
}

// Funções para Planos Promocionais
async function carregarPlanos() {
  try {
    const resposta = await fetch('http://localhost:3000/planos');
    const planos = await resposta.json();

    const lista = document.getElementById('lista-planos');
    lista.innerHTML = '';

    planos.forEach(plano => {
      const item = document.createElement('li');
      item.textContent = `${plano.nome} - ${plano.descricao} - R$ ${plano.preco}`;

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.onclick = () => excluirPlano(plano.id);

      item.appendChild(botaoExcluir);
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error('Erro ao carregar planos:', erro);
  }
}

// Funções para Presenças
async function carregarPresencas() {
  try {
    const resposta = await fetch('http://localhost:3000/presencas');
    const presencas = await resposta.json();

    const lista = document.getElementById('lista-presencas');
    lista.innerHTML = '';

    presencas.forEach(presenca => {
      const item = document.createElement('li');
      item.textContent = `Aluno ID: ${presenca.aluno_id} - Aula ID: ${presenca.aula_id} - Data: ${presenca.data}`;

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.onclick = () => excluirPresenca(presenca.id);

      item.appendChild(botaoExcluir);
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error('Erro ao carregar presenças:', erro);
  }
}

// Carregar todos os dados ao carregar a página
carregarAlunos();
carregarAgendamentos();
carregarPlanos();
carregarPresencas();
