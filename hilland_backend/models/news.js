const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  content: { 
    type: String,
    required: true
  },
  url: String,
  date: { 
    type: Date,
    required: true 
  },
  imageURL: String
})
  
newsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('News', newsSchema)