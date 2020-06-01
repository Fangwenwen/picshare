import Vue from 'vue'

const facebookShare = Vue.directive('facebook-share', {
  bind: function (el, binding, vnode) {
    CheckComponentMethods()
    let appId = binding.value.appId
    let href = binding.value.href
    let facebookAPI = document.createElement('script')
    facebookAPI.setAttribute('src', '//connect.facebook.net/en_US/sdk.js')
    document.head.appendChild(facebookAPI)

    facebookAPI.onload = InitFacebookButton

    function InitFacebookButton() {
      FB.init({
        appId: appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1'
      })
    }

    el.addEventListener('click', PopUp)

    function PopUp() {
      FB.ui({
        method: 'share',
        display: 'popup',
        href: href,
      }, function (response) {
        if (response && !response.error_code) {
          OnSuccess(response)
        } else {
          Onfail()
        }
      })
    }

    function OnSuccess(response) {
      vnode.context.shareSuccess(response)
    }

    function Onfail() {
      vnode.context.shareFail('Facebook share failed')
    }

    function CheckComponentMethods() {
      if (!vnode.context.shareSuccess) {
        throw new Error('The method shareSuccess must be defined on the component')
      }

      if (!vnode.context.shareFail) {
        throw new Error('The method shareFail must be defined on the component')
      }
    }
  }
})

export default facebookShare
