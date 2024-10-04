const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')

mongoose
  .connect(url)
  .then((result) => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Transform the objets returned by Mongo:
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // add the property `.id` from `._id` casted to a string
    returnedObject.id = returnedObject._id.toString()
    // delete the property `._id`
    delete returnedObject._id
    // delete the property `.__v`
    delete returnedObject.__v
  },
})

// Mongoose will automatically create a collection on MongoDB with the plural
// form of our document, in this case the collection will be `People`
module.exports = mongoose.model('Person', personSchema)
