import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Teacher from '../views/Teacher.vue'
import Welcome from '../components/Welcome.vue'
import StudentCheck from '../components/Student/StudentCheck.vue'
import Register from '../views/Register.vue'
import StudentHWork from '../components/Student/StudentHWork.vue'
import StudentScore from '../components/Student/StudentScore.vue'
import ClassList from '../components/Class/ClassList.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/', 
      redirect:'/login'
    },
    {
      path:'/login', 
      component: Login
    },
    {
      path:'/register',
      component:Register
    },
    {
      path:'/home',
      component: Home
    },
    {
      path:'/teacher',
      component: Teacher,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',component:Welcome
        },
        {
          path:'/student_check',component:StudentCheck
        },
        {
          path:'/student_homework',component:StudentHWork
        },
        {
          path:'/student_score',component:StudentScore
        },{
          path:'/class_list', component:ClassList
        }
      ]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=> {
  //to 将要访问的路径
  //from 从哪个路径跳转
  //next 是一个函数，表示放行 next()放行/ next('/url')强制跳转
  if( to.path === '/login'|| to.path === '/register') {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem('token'); //获取token
  if(!tokenStr){
    return next('/login');
  } else {
    next();
  }
})

export default router
