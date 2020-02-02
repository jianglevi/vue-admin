
import cookie from "cookie_js"

const adminToKen = 'admin_token';
const username = 'username'

export function getToken(){
    return cookie.get(adminToKen);
}
export function removeToken(){
    return cookie.remove(adminToKen);
}
export function setToken(toKen){
   return cookie.set(adminToKen,toKen);
}
export function setUserName(value){
   return  cookie.set(username,value);
}
export function getUserName(value){
   return cookie.get(username)
}
export function removeUserName(value){
   return cookie.remove(username)
}