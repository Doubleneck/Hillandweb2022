import axios from 'axios'
const baseUrl = '/api/news'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newsObject) => {
  const config = {
    headers: {
      'Authorization': token,
      'Content-Type': 'multipart/form-data', },
  }
  console.log(config)
  const formData = new FormData()
  formData.append('title', newsObject.title)
  formData.append('content', newsObject.content)
  formData.append('url', newsObject.url)
  formData.append('date', newsObject.date)
  formData.append('imageFile', newsObject.imageFile)


  const response = await axios.post(baseUrl, formData, config)

  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
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
