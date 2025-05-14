const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
db.query('SELECT * FROM planos', (err, results) => {
if (err) return res.status(500).json(err);
res.json(results);
});
});


router.post('/', (req, res) => {
const { nome, descricao, preco } = req.body;
const sql = 'INSERT INTO planos (nome, descricao, preco) VALUES (?, ?, ?)';
db.query(sql, [nome, descricao, preco], (err, result) => {
if (err) return res.status(500).json(err);
res.status(201).json({ id: result.insertId, nome, descricao, preco });
});
});


router.put('/:id', (req, res) => {
const { id } = req.params;
const { nome, descricao, preco } = req.body;
const sql = 'UPDATE planos SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
db.query(sql, [nome, descricao, preco, id], (err) => {
if (err) return res.status(500).json(err);
res.send('Plano atualizado com sucesso');
});
});


router.delete('/:id', (req, res) => {
db.query('DELETE FROM planos WHERE id = ?', [req.params.id], (err) => {
if (err) return res.status(500).json(err);
res.send('Plano excluído com sucesso');
});
});

module.exports = router;