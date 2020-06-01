import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/home'
import Recommend from '../components/recommend/recommend'
import Interest from '../components/interest/interest'
import Publish from '../pages/publish/publish'
import Search from '../pages/search/search'
import Users from '../pages/users/users'
import Topic from '../pages/topic/topic'
import TopicDetail from '../pages/topicDetail/topicDetail'
import StatusDetail from '../pages/statusDetail/statusDetail'
import My from '../pages/my/my'
import Personal from '../pages/personal/personal'
import Follow from '../pages/follow/follow'
import Status from '../components/status/status'
import Collection from '../components/collection/collection'
import Login from '../pages/login/login'
import Information from '../pages/information/information'
import Setting from '../pages/setting/setting'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home/recommend'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/recommend',
    children: [
      {
        path: 'recommend',
        component: Recommend
      },
      {
        path: 'interest',
        component: Interest
      }
    ]
  },
  {
    path: '/publish',
    component: Publish,
    meta: { // 标识进入该路由前需要进行登录验证
      requiresAuth: true
    }
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/topics',
    component: Topic
  },
  {
    path: '/topic-detail/:topic',
    component: TopicDetail
  },
  {
    path: '/detail/:id',
    component: StatusDetail
  },
  {
    path: '/my',
    component: My,
    redirect: '/my/status',
    children: [
      {
        path: 'status',
        component: Status,
        meta: { // 标识进入该路由前需要进行登录验证
          requiresAuth: true
        }
      },
      {
        path: 'collection',
        component: Collection,
        meta: { // 标识进入该路由前需要进行登录验证
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/personal/:id',
    component: Personal
  },
  {
    path: '/follow',
    component: Follow
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/information',
    component: Information,
    meta: { // 标识进入该路由前需要进行登录验证
      requiresAuth: true
    }
  },
  {
    path: '/setting',
    component: Setting,
    meta: { // 标识进入该路由前需要进行登录验证
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

/*
* 注册全局前置守卫
* to: Route: 即将要进入的目标 路由对象
* from: Route: 当前导航正要离开的路由
* next: Function
* */
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) { // 不存在 token,重新登录
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
