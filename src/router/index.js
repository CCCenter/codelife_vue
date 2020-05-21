import Vue from 'vue'
import VueRouter from 'vue-router'
import Publish from '../views/Publish.vue'
import Index from '../views/Index.vue'
import Nav from '../views/Nav.vue'
import Question from '../views/Question.vue'
import Login from '../views/Login.vue'
import Register from'../views/Register.vue'
import Search from'../views/Search.vue'
import Loading from '../views/Loading.vue'
import NotFound from '../views/404.vue'
import Member from '../views/Member.vue'

import Manager from '../views_manager/Manager.vue'
import Index_manager from '../views_manager/Index_manager.vue'
import Login_manager from '../views_manager/Login_manager.vue'
import Member_manager from '../views_manager/Member_manager.vue'
import Question_manager from '../views_manager/Question_manager.vue'
import Comment_manager from '../views_manager/Comment_manager.vue'
import NotFound_manager from '../views_manager/NotFound_manager.vue'
import TagType_manager from '../views_manager/TagType_manager.vue'
import Tag_manager from '../views_manager/Tag_manager.vue'
import Sensitive_manager from '../views_manager/Sensitive_manager.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Nav',
    component: Nav,
    redirect:'/index',
    children : [
      {
        path : '/index',
        name : 'index',
        component : Index
      },
      {
        path : '/publish',
        name : 'publish',
        component : Publish
      },
      {
        path : '/question/:id',
        name : '问题',
        component : Question
      },
      {
        path : '/member/:id',
        name : 'memberInfo',
        component : Member
      },
      {
        path: "/404",
        name: "NotFound",
        component: NotFound
      },
    ]
  },
  {
    path: '/Login_manager',
    name: 'login_manager',
    component: Login_manager,
  },
  {
    path: '/manager',
    name: 'manager',
    component: Manager,
    children : [
      {
        path: '/member_manager',
        name: 'member_manager',
        component: Member_manager,
      },
      {
        path: '/question_manager',
        name: 'question_manager',
        component: Question_manager,
      },
      {
        path: '/comment_manager',
        name: 'comment_manager',
        component: Comment_manager,
      },
      {
        path: '/index_manager',
        name: 'index_manager',
        component: Index_manager,
      },
      {
        path: '/tagType_manager',
        name: 'tagType_manager',
        component: TagType_manager,
      },
      {
        path: '/tag_manager/:id',
        name: 'tag_manager',
        component: Tag_manager,
      },
      {
        path: '/sensitive_manager',
        name: 'sensitive_manager',
        component: Sensitive_manager,
      },
      {
        path: '/notFound_manager',
        name: 'notFound_manager',
        component: NotFound_manager,
      },
      {
        path: "*", // 此处需特别注意置于最底部
        redirect: "/NotFount_manager"
      }
    ]
  },
  {
    path : '/login',
    name : 'login',
    component : Login
  },
  {
    path : '/register',
    name : '注册',
    component : Register
  },
  {
    path : '/search',
    name : '搜索',
    component : Search
  },
  {
    path: '/loading',
    name: '加载',
    component: Loading,
  },
  {
    path: "*", // 此处需特别注意置于最底部
    redirect: "/404"
  }
]

const router = new VueRouter({
  routes
})


export default router