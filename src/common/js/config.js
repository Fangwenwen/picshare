// 设计稿的尺寸
const designSize = 720

// 移动适配
export const mobileAdaptation = () => {
  document.documentElement.style.fontSize = `${(document.documentElement.clientWidth / designSize) * 100}px` // 移动适配
}
