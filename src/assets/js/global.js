
import { MessageBox } from 'element-ui'
export default{
    install (Vue,options){
        Vue.prototype.confirm = function(params){
            MessageBox.confirm(params.content||'内容', params.tip || '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: params.type || 'success',
                center: true
              }).then(() => {
                  params.fn && params.fn(params.data || '')
              }).catch(() => {
                params.catchFn && params.catchFn(params.data || '')
              });
        }
    }
} 