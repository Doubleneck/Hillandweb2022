import axios from 'axios'
import { useToken } from '../hooks/useToken'

const baseUrl = '/api/archives'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (archiveObject) => {
  const token = useToken()
  const config = {
    headers: {
      'Authorization': token,
      'Content-Type': 'multipart/form-data', },
  }
  const formData = new FormData()
  formData.append('title', archiveObject.title)
  formData.append('content', archiveObject.content)
  formData.append('year', archiveObject.year)
  formData.append('imageFile', archiveObject.imageFile)

  const response = await axios.post(baseUrl, formData, config)
  return response.data
}

const update = async (id, newObject) => {
  const token = useToken()
  const config = {
    headers: {
      'Authorization': token,
    },
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