

const app = {
    state: {
        // isCollapse: Cookie.get('isCollapse') || false,
        isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
      },
      getters:{
    
      },
      mutations: {
        handleIsCollapse(state){
          state.isCollapse=!state.isCollapse;
          sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse))
          // Cookie.set('isCollapse',JSON.stringify(state.isCollapse))
        }
    
      },
      actions: {
        login(context,responseData){
          return new Promise ((resolve,reject)=>{
            //接口
            Login(responseData)
            .then(response => {
              // 页面跳转控制台
              resolve()
            })
            .catch(error => {
              reject()
            });
           
          })
        }
      },
}
export default app;