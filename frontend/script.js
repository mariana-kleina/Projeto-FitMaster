
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

document.getElementById('form-aluno').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const plano = document.getElementById('plano').value;

  try {
    await fetch('http://localhost:3000/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, plano })
    });

    document.getElementById('form-aluno').reset();
    carregarAlunos();
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', erro);
  }
});

async function excluirAluno(id) {
  if (confirm('Tem certeza que deseja excluir este aluno?')) {
    try {
      await fetch(`http://localhost:3000/alunos/${id}`, { method: 'DELETE' });
      carregarAlunos();
    } catch (erro) {
      console.error('Erro ao excluir aluno:', erro);
    }
  }
}

async function editarAluno(aluno) {
  const nome = prompt('Novo nome:', aluno.nome);
  const email = prompt('Novo email:', aluno.email);
  const plano = prompt('Novo plano:', aluno.plano);

  if (nome && email && plano) {
    try {
      await fetch(`http://localhost:3000/alunos/${aluno.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, plano })
      });
      carregarAlunos();
    } catch (erro) {
      console.error('Erro ao editar aluno:', erro);
    }
  }
}

carregarAlunos();
