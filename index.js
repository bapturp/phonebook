const express = require('express')
const app = express()
const persons = require('./data')

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
