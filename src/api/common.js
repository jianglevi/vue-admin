
import { GetCategory, } from "@/api/news"
import {reactive} from "@vue/composition-api"
export function common(){
    const categorycommon = reactive({
        item:[]
    })
    const getCategorycommon = ()=>{
        GetCategory({}).then(response=>{
            categorycommon.item = response.data.data.data
        }).catch(error=>{

        })
    }
    return {
        getCategorycommon,
        categorycommon
    }
}