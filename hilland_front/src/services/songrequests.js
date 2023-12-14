import axios from 'axios'
import { useToken } from '../hooks/useToken'
const baseUrl = '/api/songrequests'

const getAll = () => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)

  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const token = useToken()
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
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
