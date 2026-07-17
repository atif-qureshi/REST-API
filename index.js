const express = require('express');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;
const fs = require('fs');
const { json } = require('stream/consumers');

app.use(express.json());

app.use(express.urlencoded({extended: false}));

//Routes:
app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.param('id', (req, res, next, id) => { 
    const userId = Number(id);
    const user = users.find((user) => user.user_id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
});

app.get('/users', (req, res) => {
    const html = `
    <ul>
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users/:id', (req, res) => {
    return res.json(req.user);
});

app.post('/api/users', (req, res) => {
    const body = req.body;
    const newUser = { ...body, user_id: users.length + 1 };
    users.push(newUser);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not save user' });
        }

        return res.json({ status: 'success', user: newUser });
    });
});

app.patch('/api/users/:id', (req, res) => {
    const updates = req.body;
    const userIndex = users.findIndex((user) => user.user_id === req.user.user_id);

    if (userIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...updates };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not save changes' });
        }

        return res.json({ status: 'success', user: users[userIndex] });
    });
});

app.put('/api/users/:id', (req, res) => {
    const replacement = req.body;
    const userIndex = users.findIndex((user) => user.user_id === req.user.user_id);

    if (userIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    users[userIndex] = { ...replacement, user_id: req.user.user_id };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not save user' });
        }

        return res.json({ status: 'success', user: users[userIndex] });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const userIndex = users.findIndex((user) => user.user_id === req.user.user_id);

    if (userIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not delete user' });
        }

        return res.json({ status: 'success', user: deletedUser });
    });
});

app.listen(PORT, () => console.log(`Server Started At Port: ${PORT}`));

