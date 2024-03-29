import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl, config)
  return response.data.sort((a, b) => b.likes - a.likes)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response
}

const update = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const updatedBlog = {
    user: blog.user.id,
    likes: blog.likes,
    author: blog.author,
    title: blog.title,
    url: blog.url,
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog, config)
  return response.data
}

export default { getAll, create, remove, update, setToken }
