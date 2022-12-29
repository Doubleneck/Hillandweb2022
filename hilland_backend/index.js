require('dotenv').config()
const express = require("express");
const app = express();
const News = require('./models/news')
var bodyParser = require('body-parser')
app.use(bodyParser({limit: '2mb'}))
app.use(express.json())
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("<h1>Hello Hilland World!</h1>");
});

app.get("/api/news", (req, res) => {
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
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.post('/api/news', (request, response) => {
  const news = new News({
    title: request.body.title,
    content: request.body.content,
    date: new Date(),
    picture: request.body.picture
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

