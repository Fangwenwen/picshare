import axios from './index'

// 发送验证码
export const sendCode = (phone) => {
  let url = '/codes/',
    params = {
      mobile: phone
    }
  return axios.post(url, params)
}

// 登录
export const login = (username, password, is_exist) => {
  let url, params
  if (is_exist === 0) { // 首次登录
    url = '/users/'
    params = {
      username,
      code: password,
      mobile: username,
      password: 123456,
      picture: 'https://www.woyaogexing.com/touxiang/katong/2019/757779.html'
    }
  } else if (is_exist === 1) { // 非首次登录
    url = '/login/'
    params = {
      username,
      password
    }
  }
  return axios.post(url, params)
}

// 获取用户信息
export const getUserInfo = () => {
  let url = '/users/1/'
  return axios.get(url)
}

// 第三方登录,获取到 token 发送给服务端的接口
export const convertToken = (thirdparty, token) => {
  let url = '/auth/convert-token/',
    params = {
      grant_type: 'convert_token',
      client_id: '1VrpOAxOpJqVi3aSqjBcSyzgVioGvPNG0S1SU37v',
      client_secret: 'jB2rpgOdss8htgFGfygqjAK5vtXjrMF0ORg0wYEoVDquNTYYIeoFUdQj36VtIzhaFdcohRWkoRweUCUciX50MXifLraJUyAaePhVCdZaQAE8VLvIMafxxarozLzm1pVI',
      backend: thirdparty,
      token
    }
  return axios.post(url, params)
}

// 图片上传
export const imgUpload = (formData) => {
  let url = '/logo/'
  return axios.post(url, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 更新用户信息
export const updateUserInfo = (username, name, birthday, gender, picture) => {
  let url = '/users/1/',
    params = {
      username,
      name,
      birthday,
      gender,
      picture
    }
  return axios.put(url, params)
}

// 获取登录用户的关注数、粉丝数、动态数、收藏数
export const getUserStatistic = () => {
  let url = '/userStatistic/'
  return axios.get(url)
}

// 获取其他用户的信息
export const getOneUserInfo = (user, page_size, page) => {
  let url = '/userPage/',
    params = {
      params: {
        user,
        page_size,
        page
      }
    }
  return axios.get(url, params)
}
