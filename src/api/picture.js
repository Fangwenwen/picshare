import axios from './index'

// 单张图片上传
export const imgUpload = (formData) => {
  let url = '/logo/'
  return axios.post(url, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 多张图片上传
export const imgListUpload = (formData) => {
  let url = '/upload/pictures/'
  return axios.post(url, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 获取首页列表
export const getRecommendList = (pageSize, page) => {
  let url = `/rankList/?page_size=${pageSize}&page=${page}`
  return axios.get(url)
}

// 获取动态详情
export const getStatusDetail = (id) => {
  let url = `/rankList/${id}/`
  return axios.get(url)
}

// 动态发布
export const publish = (author, detail, picture_list, tag_list) => {
  let url = '/createInfo/',
    params = {
      author,
      detail,
      picture_list,
      tag_list
    }
  return axios.post(url, params)
}

// 删除动态
export const deleteStatus = (id) => {
  let url = `/list/${id}`
  return axios.delete(url)
}

// 获取热门话题
export const getHotTopicList = () => {
  let url = '/hotWords/'
  return axios.get(url)
}

// 获取某个话题下的动态
export const getStatusListByTopic = (tag, order, page_size, page) => {
  let url = '/tagPage/',
    params = {
      params: {
        tag,
        order,
        page_size,
        page
      }
    }
  return axios.get(url, params)
}

// 获取我的话题列表
export const getMyTopicList = () => {
  let url = '/tag/1'
  return axios.get(url)
}

// 获取分类话题列表
export const getTopicList = () => {
  let url = '/hotTags/'
  return axios.get(url)
}

// 获取个人动态列表
export const getPersonalList = (pageSize, page) => {
  let url = `/list/?page_size=${pageSize}&page=${page}`
  return axios.get(url)
}

// 收藏某条动态
export const collection = (article) => {
  let url = '/userCollection/',
    params = {
      article
    }
  return axios.post(url, params)
}

// 取消收藏某条动态
export const cancelCollection = (article) => {
  let url = `/userCollection/${article}/`
  return axios.delete(url)
}

// 获取我的收藏列表
export const getCollectionList = (pageSize, page) => {
  let url = `/userCollection/?page_size=${pageSize}&page=${page}`
  return axios.get(url)
}

// 关注某个用户
export const follow = (userId) => {
  let url = '/userFollow/',
    params = {
      concerned: userId
    }
  return axios.post(url, params)
}

// 取消关注某个用户
export const cancelFollowing = (concernedId) => {
  let url = `/userFollow/${concernedId}/`
  return axios.delete(url)
}

// 获取关注的用户列表
export const getFollowList = (user_id) => {
  let url = '/userFollow/',
    params = {
      params: {
        user_id
      }
    }
  return axios.get(url, params)
}

// 获取粉丝列表
export const getFansList = (user_id) => {
  let url = '/userFans/',
    params = {
      params: {
        user_id
      }
    }
  return axios.get(url, params)
}

// 获取关注人的动态列表
export const getConcernedList = (pageSize, page) => {
  let url = `/concernedList/?page_size=${pageSize}&page=${page}`
  return axios.get(url)
}

// 搜索
export const search = (val) => {
  let url = '/search/',
    params = {
      params: {
        q: val
      }
    }
  return axios.get(url, params)
}

// 搜索用户
export const searchUser = (val, page_size, page) => {
  let url = '/searchUser/',
    params = {
      params: {
        q: val,
        page_size,
        page
      }
    }
  return axios.get(url, params)
}

// 搜索动态
export const searchStatus = (val, page_size, page) => {
  let url = '/searchInfo/',
    params = {
      params: {
        q: val,
        page_size,
        page
      }
    }
  return axios.get(url, params)
}

// 获取推荐关注的用户
export const getRecommendUser = (user_id) => {
  let url = '/userRecommend/',
    params = {
      params: {
        user_id
      }
    }
  return axios.get(url, params)
}

