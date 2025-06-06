const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /presencas - Registra nova presença
router.post('/', async (req, res) => {
  const { aluno_id, aula_id, data } = req.body;
  try {
    await db.query('INSERT INTO presencas (aluno_id, aula_id, data) VALUES (?, ?, ?)', [aluno_id, aula_id, data]);
    res.status(201).json({ mensagem: 'Presença registrada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar presença' });
  }
});

// DELETE /presencas/:id - Exclui uma presença
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM presencas WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Presença excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir presença' });
  }
});

module.exports = router;