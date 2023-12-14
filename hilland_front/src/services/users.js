import axios from 'axios'
import { useToken } from '../hooks/useToken'
const baseUrl = '/api/users'

const getAll = async () => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl, config)

  return response.data
}

const create = async (userObject) => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, userObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove }