const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /planos - Lista todos os planos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM planos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar planos' });
  }
});

// POST /planos - Cadastra novo plano
router.post('/', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  try {
    await db.query('INSERT INTO planos (nome, descricao, preco) VALUES (?, ?, ?)', [nome, descricao, preco]);
    res.status(201).json({ mensagem: 'Plano cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar plano' });
  }
});

// PUT /planos/:id - Atualiza um plano existente
router.put('/:id', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const { id } = req.params;
  try {
    await db.query('UPDATE planos SET nome = ?, descricao = ?, preco = ? WHERE id = ?', [nome, descricao, preco, id]);
    res.json({ mensagem: 'Plano atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar plano' });
  }
});

// DELETE /planos/:id - Exclui um plano
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM planos WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Plano excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir plano' });
  }
});

module.exports = router;