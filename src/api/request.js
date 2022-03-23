import axios from 'axios'

const requests = axios.create({
    baseURL:'http://127.0.0.1:3000/',
    timeout:5000,
    headers:{}
});
//请求拦截器
requests.interceptors.request.use((config)=>{
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
    if (res.headers['content-type'] == "application/file") {
        return res
    }
    return res;
},(error)=>{
    return Promise.reject(error);
})


export default requests;