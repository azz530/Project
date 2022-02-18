import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/', redirect:'/login'
    },
    {
      path:'/login', component: Login
    },
    {
      path:'/home',component: Home
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=> {
  //to 将要访问的路径
  //from 从哪个路径跳转
  //next 是一个函数，表示放行 next()放行/ next('/url')强制跳转
  if(to.path === '/login') {
    return next();
  }
  // const token = window.sessionStorage.getItem('token'); 获取token
  // if(!token){
  //   return next('/login');
  // } else {
  //   next();
  // }
  if(to.path === '/home'){
    return next();
  }
})

export default router
