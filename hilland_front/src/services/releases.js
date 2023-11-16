import axios from 'axios'
const baseUrl = '/api/releases'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (releaseObject) => {
  const config = {
    headers: {
      'Authorization': token,
      'Content-Type': 'multipart/form-data', },
  }
  const formData = new FormData()
  formData.append('title', releaseObject.title)
  formData.append('content', releaseObject.content)
  formData.append('year', releaseObject.year)
  formData.append('listenLink', releaseObject.listenLink)
  formData.append('buyLink', releaseObject.buyLink)
  formData.append('imageFile', releaseObject.imageFile)

  const response = await axios.post(baseUrl, formData, config)
  return response.data
}

const update = async (id, newObject) => {

  const config = {
    headers: {
      'Authorization': token,
    },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }