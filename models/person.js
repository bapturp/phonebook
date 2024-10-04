const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('Connecting to MongoDB...')

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: {
    type: String,
    validate: { validator: (v) => /^\d{2,3}-\d+$/.test(v) },
  },
})

// Transform the objets returned by Mongo:
personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
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
