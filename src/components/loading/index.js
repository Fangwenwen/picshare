import Vue from 'vue'
import Loading from './loading'

const loadingClass = Vue.extend(Loading)

Loading.install = () => {

  if (!loadingClass.instance) {
    loadingClass.instance = new loadingClass()
  } else {
    return loadingClass.instance
  }

  loadingClass.instance.$mount()

  document.body.append(loadingClass.instance.$el)

  Vue.$loading = {
    show() {
      loadingClass.instance.visible = true
    },
    hide() {
      loadingClass.instance.visible = false
    }
  }
}

export default Loading
