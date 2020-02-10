
import {Login} from '@/api/login'
import {setToken,setUserName,getUserName,removeToken,removeUserName } from '@/assets/js/app.js'

const state = {
   // isCollapse: Cookie.get('isCollapse') || false,
        isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
        to_ken:'',
        username: getUserName() || '',
 }

const getters = {
    isCollapse:state=>state.isCollapse,
    username:state=>state.isCollapse,
}

const mutations = {
  handleIsCollapse(state){
          state.isCollapse=!state.isCollapse;
          sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse))
          // Cookie.set('isCollapse',JSON.stringify(state.isCollapse))
        },
  SET_TOKEN(state,value){
    state.to_ken=value;
  },
  SET_USERNAME(state,value){
    state.username=value
  },

}

const actions = {
  login(context,responseData){
    return new Promise ((resolve,reject)=>{
      //接口
      Login(responseData)
      .then(response => {
        // 页面跳转控制台
        let data = response.data.data;
        let token =data.token;
        let username = data.username;
        setToken(token);
        setUserName(username);
       context.commit('SET_TOKEN',token);
       context.commit('SET_USERNAME',username); 
        resolve(response)
      })
      .catch(error => {
        reject()
      });
     
    })
  },
  Exit(context){
    return new Promise((resolve,reject)=>{
      removeToken();
      removeUserName();
      
      context.commit('SET_TOKEN','')
      context.commit('SET_USERNAME','')
      resolve()
    })
  }
}

export default {
  namespaced:true,
  state,getters,mutations,actions};