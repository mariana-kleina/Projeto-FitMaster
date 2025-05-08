
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM alunos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nome, email, plano } = req.body;
  const sql = 'INSERT INTO alunos (nome, email, plano) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, plano], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, nome, email, plano });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, plano } = req.body;
  const sql = 'UPDATE alunos SET nome = ?, email = ?, plano = ? WHERE id = ?';
  db.query(sql, [nome, email, plano, id], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Aluno atualizado com sucesso');
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM alunos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Aluno excluído com sucesso');
  });
});

module.exports = router;
