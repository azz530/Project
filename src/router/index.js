import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/', 
      redirect:'/login'
    },
    {
      path:'/login', 
      component: resolve => require(['../views/Login.vue'],resolve),
    },
    {
      path:'/register',
      component: resolve => require(['../views/Register.vue'],resolve),
    },
    {
      path:'/home',
      component: resolve => require(['../views/Home.vue'],resolve),
    },
    {
      path:'/teacher',
      component: resolve => require(['../views/Teacher.vue'],resolve),
      redirect:'/teacherInfo',
      children:[
        {
          path:'/teacherInfo',component:resolve => require(['../views/Teacher/TeacherIndex.vue'],resolve),
        },
        {
          path:'/student_check',component:resolve => require(['../views/Teacher/Student/StudentCheck.vue'],resolve),
        },
        {
          path:'/student_homework',component:resolve => require(['../views/Teacher/Student/StudentHWork.vue'],resolve),
        },
        {
          path:'/student_score',component:resolve => require(['../views/Teacher/Student/StudentScore.vue'],resolve),
        },
        {
          path:'/class_list', component:resolve => require(['../views/Teacher/Class/ClassList.vue'],resolve),
        },
        {
          path:'/class_notice',component:resolve => require(['../views/Teacher/Class/Notice.vue'],resolve),
        },
        {
          path:'/scoreAnalyse',component:resolve => require(['../views/Teacher/Score/ScoreAnalyse.vue'],resolve),
        },
      ]
    },
    {
      path:'/admin',
      component: resolve => require(['../views/Admin.vue'],resolve),
      redirect:'/adminInfo',
      children:[
        {
          path:'/admin_std',component: resolve => require(['../views/Admin/StudentInfo.vue'],resolve),
        },
        {
          path:'/admin_grade',component: resolve => require(['../views/Admin/GradeInfo.vue'],resolve),
        },
        {
          path:'/admin_class',component: resolve => require(['../views/Admin/ClassInfo.vue'],resolve),
        },
        {
          path:'/admin_course',component: resolve => require(['../views/Admin/CourseInfo.vue'],resolve),
        },
        {
          path:'/admin_teacher',component: resolve => require(['../views/Admin/TeacherInfo.vue'],resolve),
        },
        {
          path:'/adminInfo',component: resolve => require(['../views/Admin/AdminIndex.vue'],resolve),
        },
      ]
    },
    {
      path:'/userInfo',
      component: resolve => require(['../views/UserInfo.vue'],resolve),
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
    if(to.path === '/admin' || to.path === '/adminInfo'){
      // console.log(this.$store.userInfo.identity);
      console.log(to);
      // console.log(store.state.userInfo.identity);
      if(store.state.userInfo.identity === 'admin'){
        next();
      } else {
        return next('/home')
      }
    }
    next();
  }
})

export default router
