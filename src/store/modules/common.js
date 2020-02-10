
import { GetCategory ,GetCategoryAll } from "@/api/news"

const actions = {
    getCategory(context,responseData){
      return new Promise ((resolve,reject)=>{
        //接口
        GetCategory({})
        .then(response => {
            let data =response.data.data.data
            resolve(data)
        })
        .catch(error => {
            reject(error)
        });
       
      })
    },
    getCategoryAll(context,responseData){
      return new Promise ((resolve,reject)=>{
        //接口
        GetCategoryAll({})
        .then(response => {
            let data =response.data.data;
            console.log(response,123)
            resolve(data)
        })
        .catch(error => {
            reject(error)
        });
       
      })
    },
  };
    

  
  
  export default {
    namespaced:true,
    actions};