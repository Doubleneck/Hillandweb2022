const express = require("express");
const app = express();
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

let news = [
  {
    id: 1,
    title: "Demonews #1",
    content: "HTML is easy",
    picture: "",
  },
  {
    id: 2,
    title: "Demonews #2",
    content: "HTML is easy2",
    picture: "",
  },
  {
    id: 3,
    title: "Demonews #3",
    content: "HTML is easy3",
    picture: "",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Hilland World!</h1>");
});

app.get("/api/news", (req, res) => {
  res.json(news);
});

app.get('/api/news/:id', (request, response) => {
  const id = Number(request.params.id)
  const thisnews = news.find(n => n.id === id)
  //response.json(thisnews)
  if (thisnews) {
    response.json(thisnews)
  } else {
    response.status(404).end()
  }
})

app.post('/api/news', (request, response) => {
  const maxId = news.length > 0
    ? Math.max(...news.map(n => n.id)) 
    : 0

  const thisnews = request.body
  thisnews.id = maxId + 1
  news = news.concat(thisnews)
  response.json(news)
})
app.delete('/api/news/:id', (request, response) => {
  const id = Number(request.params.id)
  news = news.filter(n => n.id !== id)
  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

