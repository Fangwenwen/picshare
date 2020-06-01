const mutations = {
  // 设置用户信息
  setUser(state, user) {
    state.user = user
  },
  // 设置话题
  addTopic(state, topic) {
    state.topic.splice(0, 1, topic)
  },
  // 重置话题
  clearTopic(state) {
    state.topic = []
  },
  // 设置文章内容
  setContent(state, content) {
    state.content = content
  },
  // 设置文件列表
  setFileList(state, files) {
    state.fileList = files
  },
  // 添加文件
  addFiles(state, files) {
    state.fileList.push(...files)
  },
  // 删除指定 index 的文件
  removeOneFile(state, index) {
    state.fileList.splice(index, 1)
  }
}

export default mutations
