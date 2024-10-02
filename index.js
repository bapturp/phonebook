const express = require('express')
const morgan = require('morgan')
let persons = require('./data')

const app = express()

// Parse json if the content type is `application/json`
app.use(express.json())

// Morgan logger middleware
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  personExists = persons.find((p) => p.name === person.name)
  if (personExists) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  person.id = Math.round(Math.random() * 99999999)

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
