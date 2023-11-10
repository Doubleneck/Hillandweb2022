const songrequestRouter = require('express').Router()
const Songrequest= require('../models/songrequest')
const validator = require('validator')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  

songrequestRouter.get('/', userLoggedInValidator, async (req, res) => {

  const songrequests = await Songrequest.find({})
  res.json(songrequests)
})

songrequestRouter.put('/:id',  userLoggedInValidator, adminCredentialsValidator, async (request, response, next) => {

  try {
    const id = request.params.id

    if (!validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid song request ID format' })
    }

    const { song, artist } = request.body

    if (!song || !artist) {
      return response.status(400).json({ error: 'Song and artist must be provided' })
    }

    const songrequestToUpdate = {
      title: song,
      content: artist,
    }

    const updatedSongrequest = await Songrequest.findByIdAndUpdate(id, songrequestToUpdate, { new: true })

    if (!updatedSongrequest) {
      return response.status(404).json({ error: 'Song request not found' })
    }

    response.json(updatedSongrequest)
  } catch (error) {
    next(error)
  }
})


songrequestRouter.post('/', async (request, response) => {
 
  try {
    const { song, artist } = request.body

    if (!song || song.trim() === '') {
      return response.status(400).json({ error: 'Song cannot be empty' })
    }

    const songrequest = new Songrequest({
      song: song,
      artist: artist,
      date: new Date(),
    })

    const savedSongrequest = await songrequest.save()
    return response.status(201).json(savedSongrequest)
  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' })
  }
})

songrequestRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator,async (request, response) => {
  try {
    const id = request.params.id

    if (!validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid song request ID format' })
    }

    const deletedSongrequest = await Songrequest.findByIdAndRemove(id)

    if (!deletedSongrequest) {
      return response.status(404).json({ error: 'Song request not found' })
    }

    return response.status(204).end()
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = songrequestRouter
