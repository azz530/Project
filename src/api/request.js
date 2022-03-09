import axios from 'axios'

const requests = axios.create({
    baseURL:'http://127.0.0.1:3000/',
    timeout:5000
});
//请求拦截器
requests.interceptors.request.use((config)=>{
    return config;
},(err)=>{
    return Promise.reject(err);
})

//响应拦截器 
requests.interceptors.response.use((res)=>{
    return res;
},(error)=>{
    return Promise.reject(error);
})

export default requests;