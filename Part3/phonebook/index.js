console.log("DB_URI =", process.env.DB_URI);


const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Person = require('./models/person.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('dist'))

morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const uri = process.env.DB_URI;

mongoose.connect(uri)
    .then(() => console.log('Connected!'))
    .catch(error => console.error('Failed:', error));


app.get('/api/persons', (req, res, next) => {
    Person.find({}).then((persons) => res.json(persons)).catch(error => next(error));
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({}).then(count => {
        res.send(`
      <p>Phonebook has info for ${count} people<//p>
      <p>${new Date()}</p>
    `)
    }).catch(error => next(error));
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then
    (person => {
        res.send(person);
    }).catch(error => {
        next(error);
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(
        result => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).send('Not Found');
            }
        }
    ).catch(error => {
        next(error);
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const {name, number} = req.body;

    Person.findById(id).then(
        person => {
            if (!person) {
                return res.status(404).end();
            }

            person.name = name;
            person.number = number;

            return person.save().then(updatedPerson => {
                res.json(updatedPerson);
            })
        }).catch(error => {
        next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({error: 'name or number missing'});
    }

    Person.findOne({name: body.name}).then((person) => {
        if (person) {
            return res.status(400).send('Name already in use');
        }

        const newPerson = new Person({
            name: body.name,
            number: body.number
        });

        newPerson.save().then(result => {
            res.json(result);
        }).catch(error => {
            next(error);
        })
    })
})

const errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error.name === 'CastError') {
        return res.status(400).json({error: 'malformatted id'})
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    return res.status(500).json({error: 'something went wrong'})

}

app.use(errorHandler);


app.listen(3001, () => {
    console.log('Server running on port 3001');
})