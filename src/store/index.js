import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin:false,
    token:"",
    userInfo:{
      username:'',
      id:'',
      identity:'',
    }
  },
  mutations: {
    setToken(state,tokenStr){
      state.token = tokenStr;
      axios.defaults.headers.common['Authorization'] = tokenStr;
    },
    setLoginStatus(state,LoginStatus){
      state.isLogin = LoginStatus;
    },
    setUserInfo(state,userInfo){
      state.userInfo = userInfo;
    },
  },
  actions: {
  },
  modules: {
  }
})
