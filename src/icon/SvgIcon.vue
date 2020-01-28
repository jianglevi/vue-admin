<template>
    <div>
        {{title}}
    </div>
</template>

<script>
import { reactive, ref, isRef, onMounted } from "@vue/composition-api";
export default {
    name:'svgicon',
    setup(){
        const title=ref('前端项目');


        return {title}
    },


    
}
</script>

<style lang="less" scoped>

</style>