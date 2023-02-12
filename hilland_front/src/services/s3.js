import axios from 'axios'
//const baseUrl = 'http://localhost:3001/api/s3url'
const baseUrl = '/api/s3url'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const sendToS3 = async (file) => {
  const config = {
    headers: { Authorization: token },
  }
  const { url } = await fetch(baseUrl, config).then((res) => res.json()) ///FIX THIS !!!
  await fetch(url, {
    method: 'put',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: file,
  })
  const imageUrl = await url.split('?')[0]
  return imageUrl
}

const deleteFromS3 = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.post(baseUrl, id, config)
}

export default { setToken, sendToS3, deleteFromS3 }