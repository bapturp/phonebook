const mongoose = require('mongoose')
require('dotenv').config()

if (!process.argv.length === 2 || !process.argv.length === 4) {
  console.log(
    `wrong number of arguments, usage:
    node mongo.js <MONGO_DB_PASSWORD>
    node mongo.js <MONGO_DB_PASSWORD> <NAME> <PHONE_NUMBER>`
  )
  process.exit(1)
}

const url = process.env.MONGODB

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const getPeople = () => {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person))
    mongoose.connection.close()
  })
}

const savePerson = () => {
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

switch (process.argv.length) {
  case 2:
    getPeople()
    break
  case 4:
    savePerson()
    break
}
