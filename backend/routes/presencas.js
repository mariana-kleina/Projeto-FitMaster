const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', (req, res) => {
const { aluno_id, aula_id, data } = req.body;
const sql = 'INSERT INTO presencas (aluno_id, aula_id, data) VALUES (?, ?, ?)';
db.query(sql, [aluno_id, aula_id, data], (err, result) => {
if (err) return res.status(500).json(err);
res.status(201).json({ id: result.insertId, aluno_id, aula_id, data });
});
});


router.delete('/:id', (req, res) => {
db.query('DELETE FROM presencas WHERE id = ?', [req.params.id], (err) => {
if (err) return res.status(500).json(err);
res.send('Presença excluída com sucesso');
});
});

module.exports = router;