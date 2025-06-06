const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '162912', 
  database: 'fitmaster2'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL com ID:', db.threadId);
});

// =================== ALUNOS ===================

// GET todos os alunos (com nome do plano)
app.get('/alunos', (req, res) => {
  const sql = `
    SELECT alunos.id, alunos.nome, alunos.email, alunos.plano_id, planos.nome AS plano_nome
    FROM alunos
    LEFT JOIN planos ON alunos.plano_id = planos.id
  `;
  db.query(sql, (err, result) => {
    if (err) {
        console.error('Erro ao buscar alunos:', err);
        return res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
    res.json(result);
  });
});

// POST novo aluno
app.post('/alunos', (req, res) => {
  const { nome, email, plano_id } = req.body;
  const sql = 'INSERT INTO alunos (nome, email, plano_id) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, plano_id], (err, result) => {
    if (err) {
        console.error('Erro ao cadastrar aluno:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar aluno' });
    }
    res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso!', id: result.insertId });
  });
});

// PUT editar aluno
app.put('/alunos/:id', (req, res) => {
  const { nome, email, plano_id } = req.body;
  const sql = 'UPDATE alunos SET nome = ?, email = ?, plano_id = ? WHERE id = ?';
  db.query(sql, [nome, email, plano_id, req.params.id], (err) => {
    if (err) {
        console.error('Erro ao atualizar aluno:', err);
        return res.status(500).json({ erro: 'Erro ao atualizar aluno' });
    }
    res.json({ mensagem: 'Aluno atualizado com sucesso!' });
  });
});

// DELETE aluno
app.delete('/alunos/:id', (req, res) => {
  const sql = 'DELETE FROM alunos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
        console.error('Erro ao excluir aluno:', err);
        return res.status(500).json({ erro: 'Erro ao excluir aluno' });
    }
    res.json({ mensagem: 'Aluno excluído com sucesso!' });
  });
});

// =================== PLANOS ===================

// GET todos os planos
app.get('/planos', (req, res) => {
  db.query('SELECT * FROM planos', (err, result) => {
    if (err) {
        console.error('Erro ao buscar planos:', err);
        return res.status(500).json({ erro: 'Erro ao buscar planos' });
    }
    // Converte a string 'preco' para um número float antes de enviar ao frontend
    const planosComPrecoNumerico = result.map(plano => ({
        ...plano,
        preco: parseFloat(plano.preco) 
    }));
    res.json(planosComPrecoNumerico); 
  });
});

// POST novo plano
app.post('/planos', (req, res) => {
  const { nome, preco, duracao_meses } = req.body;
  const sql = 'INSERT INTO planos (nome, preco, duracao_meses) VALUES (?, ?, ?)';
  db.query(sql, [nome, preco, duracao_meses], (err, result) => {
    if (err) {
        console.error('Erro ao cadastrar plano:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar plano' });
    }
    res.status(201).json({ mensagem: 'Plano cadastrado com sucesso!', id: result.insertId });
  });
});

// PUT editar plano
app.put('/planos/:id', (req, res) => {
  const { nome, preco, duracao_meses } = req.body;
  const sql = 'UPDATE planos SET nome = ?, preco = ?, duracao_meses = ? WHERE id = ?';
  db.query(sql, [nome, preco, duracao_meses, req.params.id], (err) => {
    if (err) {
        console.error('Erro ao atualizar plano:', err);
        return res.status(500).json({ erro: 'Erro ao atualizar plano' });
    }
    res.json({ mensagem: 'Plano atualizado com sucesso!' });
  });
});

// DELETE plano
app.delete('/planos/:id', (req, res) => {
  const sql = 'DELETE FROM planos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
        console.error('Erro ao excluir plano:', err);
        return res.status(500).json({ erro: 'Erro ao excluir plano' });
    }
    res.json({ mensagem: 'Plano excluído com sucesso!' });
  });
});


// =================== AGENDAMENTOS ===================

// GET todos os agendamentos (COM NOME DO ALUNO)
app.get('/agendamentos', (req, res) => {
    const sql = `
        SELECT agendamentos.id, agendamentos.aluno_id, alunos.nome AS aluno_nome, agendamentos.data_hora, agendamentos.atividade
        FROM agendamentos
        JOIN alunos ON agendamentos.aluno_id = alunos.id
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao buscar agendamentos:', err);
            return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
        }
        res.json(result);
    });
});

// POST novo agendamento
app.post('/agendamentos', (req, res) => {
    const { aluno_id, data_hora, atividade } = req.body;
    const sql = 'INSERT INTO agendamentos (aluno_id, data_hora, atividade) VALUES (?, ?, ?)';
    db.query(sql, [aluno_id, data_hora, atividade], (err, result) => {
        if (err) {
            console.error('Erro ao criar agendamento:', err);
            return res.status(500).json({ erro: 'Erro ao criar agendamento' }); 
        }
        res.status(201).json({ mensagem: 'Agendamento criado com sucesso!', id: result.insertId });
    });
});

// =================== PRESENÇAS ===================

// GET todas as presenças
app.get('/presencas', (req, res) => {
  db.query('SELECT * FROM presencas', (err, result) => {
    if (err) {
        console.error('Erro ao buscar presenças:', err);
        return res.status(500).json({ erro: 'Erro ao buscar presenças' });
    }
    res.json(result);
  });
});

// POST nova presença
app.post('/presencas', (req, res) => {
  const { aluno_id, data_presenca } = req.body;
  const sql = 'INSERT INTO presencas (aluno_id, data_presenca) VALUES (?, ?)';
  db.query(sql, [aluno_id, data_presenca], (err, result) => {
    if (err) {
        console.error('Erro ao registrar presença:', err);
        return res.status(500).json({ erro: 'Erro ao registrar presença' });
    }
    res.status(201).json({ mensagem: 'Presença registrada com sucesso!', id: result.insertId });
  });
});

// =================== SERVER START ===================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});