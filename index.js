const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

morgan.token('body', function getBody(req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

const morganConfig =
  ':method :url :status :res[content-length] - :response-time ms :body';

app.use(cors());
app.use(express.json());
app.use(morgan(morganConfig));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const pageContent = `
  <span>Phonebook has info for ${numberOfPersons} people</span>
  <br />
  <span>${new Date()}</span>
  `;
  res.send(pageContent);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  persons.push(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const movieToDelete = persons.find((person) => person.id === id);
  if (!movieToDelete) {
    return res.status(404).json({
      error: 'person not found',
    });
  }
  persons.splice(persons.indexOf(movieToDelete), 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
