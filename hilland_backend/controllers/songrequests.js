const songrequestRouter = require('express').Router()
const Songrequest= require('../models/songrequest')
const jwt = require('jsonwebtoken')

songrequestRouter.get('/', async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const songrequest = await Songrequest.find({})
  res.json(songrequest)
})

songrequestRouter.put('/:id', (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (decodedToken.role !== 'admin') {
    return response
      .status(401)
      .json({ error: 'you don´t have rights for this operation' })
  }

  const songrequest = {
    title: request.body.song,
    content: request.body.artist,
  }

  Songrequest.findByIdAndUpdate(request.params.id, songrequest, { new: true })
    .then((updatedSongrequest) => {
      response.json(updatedSongrequest)
    })
    .catch((error) => next(error))
})

songrequestRouter.post('/', async (request, response) => {
 
  if (request.body.song === '') {
    console.log(response)
    return response
      .status(400)
      .json({ error: 'song can´t be empty' })
  }

  const songrequest = new Songrequest({
    song: request.body.song,
    artist: request.body.artist,
    date: new Date(),
  })
  const savedSongrequest = await songrequest.save()
  response.status(201).json(savedSongrequest)
})

songrequestRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = decodedToken
  if (user.role !== 'admin') {
    return response
      .status(401)
      .json({ error: 'you don´t have rights for this operation' })
  }

  await Songrequest.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = songrequestRouter
