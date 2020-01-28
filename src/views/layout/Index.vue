<template>
    <div :class="[menuStatus ? 'close' : 'open']" class="bg"> 
        <layout-header></layout-header>
        <layout-main></layout-main>
        <layout-nav></layout-nav>
    </div>
</template>
  
<script>
import LayoutHeader from '../component/Header'
import LayoutMain from '../component/Main'
import LayoutNav from '../component/Nav'
import { reactive, ref, isRef, onMounted, computed} from "@vue/composition-api";
export default {
    name:'layout',
    components:{LayoutHeader,LayoutMain,LayoutNav},
    setup(props,{root}){
        const menuStatus = computed(()=>{
           return root.$store.state.app.isCollapse;
           
        })
        return {
            menuStatus,
        }
    }
}
</script>

<style scoped lang='less'>
.bg{
   background-color: #fff;
}

</style>