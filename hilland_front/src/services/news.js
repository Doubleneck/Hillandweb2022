import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/news'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}
const getAll =  () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
  //return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response =  axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
  //return axios.put(`${baseUrl}/${id}`, newObject)
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = axios.delete(`${baseUrl}/${id}`, config)
  return response.data
   // return axios.delete(`${baseUrl}/${id}`)
  }

export default { getAll, create, update, remove , setToken}