import {getObjectURL} from '../common/js/util'

export const user = state => state.user

export const topic = state => state.topic

export const content = state => state.content

export const fileList = state => state.fileList

export const urlList = (state) => {
  return state.fileList.map((item) => {
    return getObjectURL(item)
  })
}
