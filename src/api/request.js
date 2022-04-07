import axios from 'axios'
import { Loading } from 'element-ui';
let loading;
function startLoading() {
    loading = Loading.service({
        lock:true,
        text:'拼命加载中...',
        background:'rgba(0,0,0,0.7)'
    })
}
function endLoading(){
    loading.close();
}
const requests = axios.create({
    baseURL:'http://127.0.0.1:3000/',
    timeout:5000,
});
//请求拦截器
requests.interceptors.request.use((config)=>{
    startLoading();
    const token = sessionStorage.getItem('token');
    if(token) {
        config.headers['Authorization'] = token;
    }
    return config;
},(err)=>{
    return Promise.reject(err);
})

//响应拦截器 
requests.interceptors.response.use((res)=>{
    endLoading();
    if (res.headers['content-type'] == "application/file") {
        return res
    }
    return res;
},(error)=>{
    return Promise.reject(error);
})


export default requests;