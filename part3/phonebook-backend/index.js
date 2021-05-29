const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :content')
)
app.use(cors())

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
]

app.get('/api/persons', (request, response) => {
  return response.json(persons)
})

app.get('/info', (request, response) => {
  return response.end(
    `Phonebook has info for ${persons.length} people.\n\n${Date()}`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if (id <= persons.length)
    return response.json(persons.find((person) => person.id === id))
  return response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  return response.status(204).end()
})

const generateId = () => {
  return Math.max(...persons.map((person) => person.id)) + 1
}

app.post('/api/persons/', (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }
  if (!request.body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }
  if (persons.some((person) => person.name === request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }
  const person = {
    name: request.body.name,
    number: request.body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT)