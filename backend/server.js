
const express = require('express');
const cors = require('cors');
const app = express();

const alunosRouter = require('./routes/alunos');

app.use(cors());
app.use(express.json());
app.use('/alunos', alunosRouter);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
