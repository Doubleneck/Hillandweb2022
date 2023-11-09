import axios from 'axios'
const baseUrl = '/api/users'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl, config)

  return response.data
}

const create = async (userObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, userObject, config)
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