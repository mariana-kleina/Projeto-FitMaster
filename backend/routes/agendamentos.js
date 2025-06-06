const express = require('express');
const router = express.Router();
const db = require('../db'); // Certifique-se de que o caminho para seu módulo de conexão com o banco está correto

// GET /agendamentos - Lista todos os agendamentos (incluindo o nome do aluno)
router.get('/', async (req, res) => {
    try {
        // Query para buscar agendamentos, fazendo JOIN com a tabela de alunos
        // para obter o nome do aluno.
        const [rows] = await db.query(`
            SELECT 
                a.id, 
                a.aluno_id, 
                a.data_hora, 
                a.atividade, 
                al.nome AS aluno_nome
            FROM 
                agendamentos a
            JOIN 
                alunos al ON a.aluno_id = al.id
            ORDER BY 
                a.data_hora DESC -- Opcional: ordenar por data e hora mais recentes
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar agendamentos:', err); 
        res.status(500).json({ erro: 'Erro ao buscar agendamentos', detalhes: err.message });
    }
});

// POST /agendamentos - Cadastra novo agendamento
router.post('/', async (req, res) => {
    // Desestrutura os dados do corpo da requisição.
    // O frontend deve enviar 'data_hora' no formato DATETIME (ex: 'AAAA-MM-DD HH:MM:SS')
    const { aluno_id, data_hora, atividade } = req.body; 

    // Validação básica de entrada
    if (!aluno_id || !data_hora || !atividade) {
        return res.status(400).json({ erro: 'Dados incompletos', detalhes: 'Todos os campos (ID do Aluno, Data/Hora, Atividade) são obrigatórios.' });
    }

    try {
        // 1. Validação Crucial: Verificar se o 'aluno_id' existe na tabela 'alunos'.
        // Isso previne erros de chave estrangeira no banco de dados.
        const [alunoExists] = await db.query('SELECT id FROM alunos WHERE id = ?', [aluno_id]);
        if (alunoExists.length === 0) {
            return res.status(400).json({ erro: 'Aluno não encontrado', detalhes: `O ID de aluno ${aluno_id} não existe.` });
        }

        // 2. Inserir o novo agendamento no banco de dados.
        const [result] = await db.query(
            'INSERT INTO agendamentos (aluno_id, data_hora, atividade) VALUES (?, ?, ?)', 
            [aluno_id, data_hora, atividade]
        );
        
        // Retorna o status 201 (Created) e o ID do novo agendamento.
        res.status(201).json({ mensagem: 'Agendamento cadastrado com sucesso!', id: result.insertId });

    } catch (err) {
        console.error('Erro ao cadastrar agendamento:', err); 
        // Em caso de erro, retorna um status 500 (Internal Server Error)
        res.status(500).json({ erro: 'Erro ao cadastrar agendamento', detalhes: err.message });
    }
});

// PUT /agendamentos/:id - Atualiza um agendamento existente
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID do agendamento da URL
    // Desestrutura os dados atualizados do corpo da requisição.
    const { aluno_id, data_hora, atividade } = req.body; 

    // Validação básica de entrada
    if (!aluno_id || !data_hora || !atividade) {
        return res.status(400).json({ erro: 'Dados incompletos', detalhes: 'Todos os campos (ID do Aluno, Data/Hora, Atividade) são obrigatórios.' });
    }

    try {
        // 1. Validação Crucial: Verificar se o 'aluno_id' existe na tabela 'alunos'.
        const [alunoExists] = await db.query('SELECT id FROM alunos WHERE id = ?', [aluno_id]);
        if (alunoExists.length === 0) {
            return res.status(400).json({ erro: 'Aluno não encontrado', detalhes: `O ID de aluno ${aluno_id} não existe.` });
        }

        // 2. Atualizar o agendamento no banco de dados.
        const [result] = await db.query(
            'UPDATE agendamentos SET aluno_id = ?, data_hora = ?, atividade = ? WHERE id = ?', 
            [aluno_id, data_hora, atividade, id]
        );
        
        // Verifica se algum registro foi realmente atualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado', detalhes: `Nenhum agendamento com ID ${id} foi encontrado para atualizar.` });
        }

        res.json({ mensagem: 'Agendamento atualizado com sucesso!' });

    } catch (err) {
        console.error('Erro ao atualizar agendamento:', err);
        res.status(500).json({ erro: 'Erro ao atualizar agendamento', detalhes: err.message });
    }
});

// DELETE /agendamentos/:id - Exclui um agendamento
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID do agendamento da URL
    try {
        const [result] = await db.query('DELETE FROM agendamentos WHERE id = ?', [id]);
        
        // Verifica se algum registro foi realmente excluído
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado', detalhes: `Nenhum agendamento com ID ${id} foi encontrado para excluir.` });
        }

        res.json({ mensagem: 'Agendamento excluído com sucesso!' });

    } catch (err) {
        console.error('Erro ao excluir agendamento:', err);
        res.status(500).json({ erro: 'Erro ao excluir agendamento', detalhes: err.message });
    }
});

module.exports = router;