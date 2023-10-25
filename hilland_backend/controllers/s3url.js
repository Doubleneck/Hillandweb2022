const s3urlRouter = require('express').Router()
require('../s3.js').generateUploadURL
const s3 = require('../s3.js')
const jwt = require('jsonwebtoken')

s3urlRouter.get('/', async (req, res) => {

  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (decodedToken.role !== 'admin') {
    return res
      .status(401)
      .json({ error: 'you don´t have rights for this operation' })
  }
  const url = await s3.generateUploadURL()
  await res.send({ url })
})

module.exports = s3urlRouter
