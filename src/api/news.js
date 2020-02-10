
import instance from "@/assets/js/request.js"

// 列表
export function GetList(data){
    return instance.request({
        method:'post',
        url:'/news/getList/',
        data
    })
}


// 新增信息
export function AddInfo(data){
    return instance.request({
        method:'post',
        url:'/news/add/',
        data
    })
}
// 添加子级分类
export function AddChildrenCategory(data){
    return instance.request({
        method:"post",
        url:"/news/addChildrenCategory/",
        data,
    })
}

// 编辑
export function EditInfo(data){
    return instance.request({
        method:"post",
        url:'/news/editInfo/',
        data
    })
}


// 删除
// 删除信息
export function DeleteInfo(data){
    return instance.request({
        method:"post",
        url:"/news/deleteInfo/",
        data
    })
}


// 一级分类添加
export function AddFirstCategory(data){
    return instance.request({
        method:'post',
        url:'/news/addFirstCategory/',
        data
    })
}
// 获取分类
export function GetCategory(data){
    return instance.request({
        method:"post",
        url:"/news/getCategory/",
        data
    })
}
// 获取分类和子级
export function GetCategoryAll(data){
    return instance.request({
        method:"post",
        url:"/news/getCategoryAll/",
        data
    })
}
// 删除分类
export function DeleteCategory(data){
    return instance.request({
        method:"post",
        url:"/news/deleteCategory/",
        data
    })
}

// 修改分类
export function EditCategory(data){
    return instance.request({
        method:"post",
        url:'/news/editCategory/',
        data
    })
}