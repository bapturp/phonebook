require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Parse json if the content type is `application/json`
app.use(express.json())

// Logger middleware
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// CORS
app.use(cors())

// Serve React app (static content)
app.use(express.static('dist'))

// routes handler
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.json([{}])
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((people) => {
      const len = people ? people.length : 0
      response.send(
        `<p>Phonebook has info for ${len} people</p><p>${Date()}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        notFound(request, response)
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

class ContentMissingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ContentMissing'
  }
}

app.post('/api/persons', async (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return next(new ContentMissingError('content missing'))
  }

  try {
    const people = await Person.find({})
    const personExists = people.find((p) => p.name === name)

    if (personExists) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = new Person({
      name: name,
      number: number,
    })

    const savedPerson = await newPerson.save()

    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

// 404 not found handler
const notFound = (request, response) => {
  response.status(404).json({ error: 'Not Found' })
}
// the not found handler must be declared after all the route handlers but before the error handler
app.use(notFound)

// 400 error handler
const errorHandler = (error, request, response, next) => {
  console.error(error)

  switch (error.name) {
    case 'CastError':
      return response.status(400).json({ error: 'malformatted id' })
    case 'ContentMissing':
      return response.status(400).json({ error: error.message })
    default:
      return response.status(500).json({ error: error })
  }
}
// Must be the last handler
app.use(errorHandler)

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
