

import router from './index'
import { getToken, } from '../assets/js/app'
const whiteRouter = ['/login'];

router.beforeEach((to,from,next)=>{
    if(getToken){
        console.log('存在')
    }else{
        if(whiteRouter.indexOf(to.path) !==-1){
            next(); 
        }else{
            next('/login')
        }
        /*
        1.直接进入index的时候，参数to被改变成了"/index"，触发路由指向，就会跑beforeEach
        2.再一次next指向了login，再次发生路由指向，再跑beforeEach，参数的to被改变成了"/login"
        3.白名单判断存在，则直接执行next（），因为没有参数，所以不会再次beforeEach。
        */
       
        console.log('bucunzai ')
    }
    console.log(to)//下一页面
    console.log(from)//上一页面
    console.log(next)
    next()
  })