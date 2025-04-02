const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Julio123.',
    database: 'cadastro_curriculos'
});

app.get('/users', (req, res) => {
    database.query('SELECT * FROM users', (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }

        res.json(results);
    })
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    database.query('INSERT INTO users (name, email, password) VALUES (?,?,?)', [name, email, password], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json({
            message: 'Usuário criado',
            id: results.insertId
        });
    })
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    database.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    database.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    database.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.get('/users/:id/curriculos', (req, res) => {
    const { id } = req.params;
    database.query('SELECT * FROM curriculos WHERE user_id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
})

app.get('/curriculos', (req, res) => {
    database.query('SELECT * FROM curriculos', (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.post('/curriculos', (req, res) => {
    const {
        name,
        email,
        cpf,
        dataNasc,
        sexo,
        estadocivil,
        escolaridade,
        cursos,
        experiencia,
        pretensao_salarial,
        user_id
    } = req.body;

    database.query(`
        INSERT INTO curriculos (
            name, 
            email,
            cpf, 
            dataNasc, 
            sexo,
            estadocivil, 
            escolaridade, 
            cursos,
            experiencia, 
            pretensao_salarial, 
            user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        , [
            name,
            email,
            cpf,
            dataNasc,
            sexo,
            estadocivil,
            escolaridade,
            cursos,
            experiencia,
            pretensao_salarial,
            user_id
        ], (error, results) => {
            if (error) {
                console.error('Erro ao criar currículo:', error);
                return res.status(500).send(error);
            }

            res.json({
                message: 'Currículo criado',
                curriculoId: results.insertId
            });
        });
});

app.put('/curriculos/:id', (req, res) => {

    const { id } = req.params;
    const {
        name,
        email,
        cpf,
        dataNasc,
        sexo,
        estadocivil,
        escolaridade,
        cursos,
        experiencia,
        pretensao_salarial,
        user_id
    } = req.body;

    database.query(`
        UPDATE curriculos SET 
            name = ?, 
            email = ?,
            cpf = ?, 
            dataNasc = ?, 
            sexo = ?, 
            estadocivil = ?, 
            escolaridade = ?, 
            cursos = ?, 
            experiencia = ?, 
            pretensao_salarial = ?,
            user_id = ? WHERE id = ?`,
        [
            name,
            email,
            cpf,
            dataNasc,
            sexo,
            estadocivil,
            escolaridade,
            cursos,
            experiencia,
            pretensao_salarial,
            user_id,
            id
        ],
        (error, results) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.json(results);
        }
    )
});

app.delete('/curriculos/:id', (req, res) => {
    const { id } = req.params;
    database.query('DELETE FROM curriculos WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.get('/curriculos/:id', (req, res) => {
    const { id } = req.params;
    database.query('SELECT * FROM curriculos WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    })
});

app.listen(3000, () => {
    console.log('Servidor rodando :)');
});