const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /agendamentos - Lista todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM agendamentos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
  }
});

// POST /agendamentos - Cadastra novo agendamento
router.post('/', async (req, res) => {
  const { aluno_id, data, horario } = req.body;
  try {
    await db.query('INSERT INTO agendamentos (aluno_id, data, horario) VALUES (?, ?, ?)', [aluno_id, data, horario]);
    res.status(201).json({ mensagem: 'Agendamento cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar agendamento' });
  }
});

// PUT /agendamentos/:id - Atualiza um agendamento existente
router.put('/:id', async (req, res) => {
  const { aluno_id, data, horario } = req.body;
  const { id } = req.params;
  try {
    await db.query('UPDATE agendamentos SET aluno_id = ?, data = ?, horario = ? WHERE id = ?', [aluno_id, data, horario, id]);
    res.json({ mensagem: 'Agendamento atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar agendamento' });
  }
});

// DELETE /agendamentos/:id - Exclui um agendamento
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Agendamento excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir agendamento' });
  }
});

module.exports = router;