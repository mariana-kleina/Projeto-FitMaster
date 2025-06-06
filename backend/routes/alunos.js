const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /alunos - Lista alunos com nome do plano
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT alunos.*, planos.nome AS nome_plano 
      FROM alunos 
      LEFT JOIN planos ON alunos.plano_id = planos.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar alunos' });
  }
});

// POST /alunos - Cadastrar novo
router.post('/', async (req, res) => {
  const { nome, email, plano_id } = req.body;
  try {
    await db.query('INSERT INTO alunos (nome, email, plano_id) VALUES (?, ?, ?)', [nome, email, plano_id]);
    res.json({ mensagem: 'Aluno cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar aluno' });
  }
});

// PUT /alunos/:id - Atualizar
router.put('/:id', async (req, res) => {
  const { nome, email, plano_id } = req.body;
  const { id } = req.params;
  try {
    await db.query('UPDATE alunos SET nome = ?, email = ?, plano_id = ? WHERE id = ?', [nome, email, plano_id, id]);
    res.json({ mensagem: 'Aluno atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar aluno' });
  }
});

// DELETE /alunos/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM alunos WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Aluno excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir aluno' });
  }
});

module.exports = router; 