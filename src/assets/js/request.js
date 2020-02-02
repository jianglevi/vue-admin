import axios from 'axios'
import {message, Message} from 'element-ui'

//axios 实例添加拦截器
const BASEURL = process.env.MODE_ENV === 'production' ? '' : '/devapi';

var instance = axios.create({
  baseURL:BASEURL,//  http://192.168.43.140:8081/devapi ===http://www.web-jshtml.cn/productapi
  timeout:10000,
  });

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config.headers['token']=111111
    // config.headers['userId']=22222
    // console.log(config)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
// 请求接口后，对数据处理
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log(response)

    let data =response.data
    if(data.resCode !== 0){
      Message.error(data.message)
      return Promise.reject(data)
    }else{
      Message.success(data.message);
      return Promise.resolve(response);
    }
    
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });



//   default只能用一次
  export default instance