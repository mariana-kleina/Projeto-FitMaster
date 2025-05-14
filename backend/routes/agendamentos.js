const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
db.query('SELECT * FROM agendamentos', (err, results) => {
if (err) return res.status(500).json(err);
res.json(results);
});
});


router.post('/', (req, res) => {
const { aluno_id, data, hora, descricao } = req.body;
const sql = 'INSERT INTO agendamentos (aluno_id, data, hora, descricao) VALUES (?, ?, ?, ?)';
db.query(sql, [aluno_id, data, hora, descricao], (err, result) => {
if (err) return res.status(500).json(err);
res.status(201).json({ id: result.insertId, aluno_id, data, hora, descricao });
});
});


router.put('/:id', (req, res) => {
const { id } = req.params;
const { aluno_id, data, hora, descricao } = req.body;
const sql = 'UPDATE agendamentos SET aluno_id = ?, data = ?, hora = ?, descricao = ? WHERE id = ?';
db.query(sql, [aluno_id, data, hora, descricao, id], (err) => {
if (err) return res.status(500).json(err);
res.send('Agendamento atualizado com sucesso');
});
});


router.delete('/:id', (req, res) => {
db.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id], (err) => {
if (err) return res.status(500).json(err);
res.send('Agendamento excluído com sucesso');
});
});

module.exports = router;