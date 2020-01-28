

import instance from '@/assets/js/request.js'

export function GetSms(data){
   return instance.request({
        method: 'post',
        url: '/getSms/',
        data
    }); 
}
   


// 获取验证码接口




//获取用户名



// 登录
export function Login(data){
    return instance.request({
        method:'post',
        url:'/login/',
        data
    })
}


// 注册
export function Register(data){
    return instance.request({
        method:'post',
        url:'/register/',
        data
    })
}