const mongoose = require('mongoose')

if (!process.argv.length === 3 || !process.argv.length === 5) {
  console.log(
    `wrong number of arguments, usage:
    node mongo.js <MONGO_DB_PASSWORD>
    node mongo.js <MONGO_DB_PASSWORD> <NAME> <PHONE_NUMBER>`
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yo7AgqB4KMEo9TmHP4Wb:${password}@cluster1.xx6kbup.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster1`

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
  const name = process.argv[3]
  const number = process.argv[4]

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
  case 3:
    getPeople()
    break
  case 5:
    savePerson()
    break
}
