import axios, { Method } from 'axios'

axios.defaults.withCredentials = true

axios.defaults.validateStatus = (status) => {
  return /^(2|3)\d{2}$/.test(String(status))
}

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)

const http = async (url: string, method: Method, params: Object = {}) => {
  let options = {
    url: url,
    method: method,
  }
  method = method.toLowerCase() as Method
  if ((['get', 'options'].indexOf(method) > -1)) {
    options['params'] = params
  } else {
    options['data'] = params
  }
  return await axios(options)
}

export default http
