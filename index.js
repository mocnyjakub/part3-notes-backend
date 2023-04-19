require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const Person = require('./models/person');

morgan.token('body', function getBody(req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

const morganConfig =
  ':method :url :status :res[content-length] - :response-time ms :body';

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(morgan(morganConfig));

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>');
// });

// app.get('/info', (req, res) => {
//   const numberOfPersons = persons.length;
//   const pageContent = `
//   <span>Phonebook has info for ${numberOfPersons} people</span>
//   <br />
//   <span>${new Date()}</span>
//   `;
//   res.send(pageContent);
// });

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    res.json(person);
  });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const movieToDelete = persons.find((person) => person.id === id);
//   if (!movieToDelete) {
//     return res.status(404).json({
//       error: 'person not found',
//     });
//   }
//   persons.splice(persons.indexOf(movieToDelete), 1);
//   res.status(204).end();
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
