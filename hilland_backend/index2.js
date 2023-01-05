require('dotenv').config()
const express = require('express')
const app = express()
const News = require('./models/news')
var bodyParser = require('body-parser')
app.use(bodyParser({limit: '2mb'}))
app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')
const { default: mongoose } = require('mongoose')
app.use(cors())
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body) 
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/', (req, res) => {
  res.send('<h1>Hello Hilland World!</h1>')
})

app.get('/api/news', (req, res) => {
  News.find({})
    .then(news => {
      res.json(news)
    })
})

app.get('/api/news/:id', (request, response) => {
  News.findById(request.params.id)
    .then(news => {
      if (news) {
        response.json(news)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/news/:id', (request, response, next) => {
  const news = {
    title: request.body.title,
    content: request.body.content,
    url: request.body.url,
    image: request.body.picture
  }

  News.findByIdAndUpdate(request.params.id, news, { new: true })
    .then(updatedNews => {
      response.json(updatedNews)
    })
    .catch(error => next(error))
})

app.post('/api/news', (request, response) => {
  const news = new News({
    title: request.body.title,
    content: request.body.content,
    date: new Date(),
    url: request.body.url,
    image: request.body.image
  })
  news.save().then(savedNews => { 
    console.log('news saved!')
    response.json(savedNews)
  }) 
})



app.delete('/api/news/:id', (request, response) => {
  News.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

