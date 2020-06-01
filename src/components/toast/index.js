import Vue from 'vue'
import Toast from './toast'

const toastClass = Vue.extend(Toast)

Toast.install = (options) => {
  if (options === undefined || options === null) {
    options = {
      message: ""
    }
  } else if (typeof options === "string" || typeof options === "number") {
    options.message = options
  }

  let instance = new toastClass({
    data: options
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

export default Toast


