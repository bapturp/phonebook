require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Parse json if the content type is `application/json`
app.use(express.json())

// Morgan logger middleware
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// CORS
app.use(cors())

// Serve frontend
app.use(express.static('dist'))

// routes handler
app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => response.json(person))
})

app.get('/info', (request, response) => {
  Person.find({}).then((people) =>
    response.send(
      `<p>Phonebook has info for ${people.length} people</p><p>${Date()}</p>`
    )
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(500).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', async (request, response) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' })
  }

  let people
  try {
    people = await Person.find({})
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: error })
  }

  const personExists = people.find((p) => p.name === name)
  if (personExists) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = new Person({
    name: name,
    number: number,
  })

  try {
    const result = await newPerson.save()
    response.json(result)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: error })
  }
})

const PORT = process.env.port || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
