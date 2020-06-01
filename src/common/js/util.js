import router from '../../router'

// 获取数组中一个元素的索引
export const getIndex = (arr, item) => {
  return arr.indexOf(item)
}

// 手机号检测
export const phoneCheck = (num) => {
  const reg = /^1[34578]\d{9}$/
  return reg.test(num)
}

// 获取图片 url
export const getObjectURL = (file) => {
  let url = null
  if (window.createObjectURL !== undefined) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

// 根据图片地址获取图片名
export const getFilenameByUrl = (url) => {
  let filename
  if (url.indexOf('/') < 0) {
    filename = url
  } else {
    filename = url.substring(url.lastIndexOf('/') + 1, url.length)
  }
  return filename
}

// 下载图片
export const downloadImg = (path, name) => {

  const img = new Image()

  // 解决跨域 Canvas 污染问题
  img.setAttribute('crossOrigin', 'anonymous')

  img.onload = () => {

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0, img.width, img.height)

    const dataURL = canvas.toDataURL('image/png') // 得到图片的base64编码数据

    const blob = dataURLtoBlob(dataURL) // 用到Blob是因为图片文件过大时，在部分浏览器上会下载失败，而Blob就不会

    const url = {
      name: name || "undefined.png",
      src: blob
    }

    if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
      navigator.msSaveBlob(url.src, url.name) // filename 文件名包括扩展名,下载路径为浏览器默认路径
    } else {
      const link = document.createElement("a")
      link.setAttribute("href", window.URL.createObjectURL(url.src))
      link.setAttribute("download", url.name)
      document.body.appendChild(link)
      link.click()
    }
  }
  img.src = path
}

// 图片压缩
// path:图片地址
// quality:图片质量
export const imgCompress = (path, quality, cb) => {

  const img = new Image()

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    // 图片原始尺寸,最大尺寸限制
    const originWidth = img.width, originHeight = img.height,
      maxWidth = 400, maxHeight = 400
    // 目标尺寸
    let targetWidth = originWidth, targetHeight = originHeight
    // 图片尺寸超过400x400的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽,按照宽度限定尺寸
        targetWidth = maxWidth
        targetHeight = Math.round(maxWidth * (originHeight / originWidth))
      } else {
        targetHeight = maxHeight
        targetWidth = Math.round(maxHeight * (originWidth / originHeight))
      }
    }

    // canvas对图片进行缩放
    canvas.width = targetWidth
    canvas.height = targetHeight

    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight)

    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight)

    canvas.toBlob((blob) => {
      cb(blob)
    }, 'image/png')
  }

  img.src = path
}

// 将 base64 的图片 url 数据转换为 Blob
export const dataURLtoBlob = (dataURL) => {

  let arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], {type: mime})
}

// 存 localStorage
export const setStorage = (name, data) => {
  if (typeof data === 'string') {
    localStorage.setItem(name, data)
    return
  }
  localStorage.setItem(name, JSON.stringify(data))
}

// 取 localStorage
export const getStorage = (name) => {
  return JSON.parse(localStorage.getItem(name))
}

// 清空 localStorage
export const clearStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// 进行需要认证的操作前，验证用户是否登录，未登录则跳转到登录页
export const verify = (redirect, callback, e) => {
  if (!localStorage.getItem('token')) {
    if (e) e.preventDefault() // 阻止默认行为
    router.push({
      path: '/login',
      query: {
        redirect: redirect
      }
    })
  } else {
    callback()
  }
}
