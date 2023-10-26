const songrequestRouter = require('express').Router()
const Songrequest= require('../models/songrequest')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  

songrequestRouter.get('/', userLoggedInValidator, async (req, res) => {

  const songrequests = await Songrequest.find({})
  res.json(songrequests)
})

songrequestRouter.put('/:id',  userLoggedInValidator, adminCredentialsValidator, (request, response, next) => {

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

songrequestRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator,async (request, response) => {
  
  await Songrequest.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = songrequestRouter
