<template>
  <div id="category">
    <el-button type="danger" size="mini" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <div class="infoLine"></div>
    <div>
      <el-row :gutter="30">
        <el-col :span="12" class="infoContent" v-loading='content_loading'>
          <div class="category" v-for="firstItem in category.item" :key="firstItem.id" >
            <div style="background-color:#fff" class="jiahao">
              <img src="@/svg/jiahao.png" alt />
            </div>
            <!-- 一级分类 -->
            <h4>
              {{firstItem.category_name}}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  round
                  @click="editCategory({data:firstItem,type:'category_first_exit'})"
                >编辑</el-button>
                <el-button size="mini" type="success" round @click="handleAddChildren({data:firstItem,type:'category_children_add'})">添加子级</el-button>
                <el-button
                  size="mini"
                  round
                  @click="deleteCategory(firstItem.id,firstItem.category_name)"
                >删除</el-button>
              </div>
            </h4>
            <!-- 二级分类 -->
            <ul v-if="firstItem.children">
              <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                {{childrenItem.category_name}}
                <div class="button-child">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
        <!-- 右部分 -->
        <el-col :span="12">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" :model="form" ref="categoryForm">
            <el-form-item label="一级分类名称：" class="infoFormItem" v-if="category_first">
              <el-input
                v-model="form.firstCategoryName"
                size="mini"
                class="infoInput"
                :disabled="firstInput"
              ></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" class="infoFormItem" v-if="category_sec">
              <el-input
                v-model="form.secCategoryName"
                size="mini"
                class="infoInput"
                :disabled="secInput"
              ></el-input>
            </el-form-item>
            <el-form-item class="infoFormItem">
              <el-button
                type="danger"
                @click="submit('ruleForm')"
                size="mini"
                :loading="button_loading"
                :disabled="buttonStatus"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AddFirstCategory, GetCategory, DeleteCategory, EditCategory ,AddChildrenCategory,GetCategoryAll} from "@/api/news";
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed,
  watch
} from "@vue/composition-api";
// +import {common } from "@/api/common.js"
export default {
  name: "category",

  setup(props, { root, refs }) {
    // +const { getCategorycommon,categorycommon } = common();
    //ref
    const content_loading = ref(true);
    const submit_button_type = ref("");
    const category_first = ref(true);
    const category_sec = ref(true);
    const button_loading = ref(false);
    const firstInput = ref(true);
    const secInput = ref(true);
    const buttonStatus = ref(true);

    // reactive
    const category = reactive({
      item: [],
      current:[],
    });
    const form = reactive({
      firstCategoryName: "",
      secCategoryName: ""
    });
    // methods
    // 编辑一级分类
    const editCategory = params => {
      submit_button_type.value = params.type;
      category_sec.value = false;
      firstInput.value = false;
      buttonStatus.value = false;
      // 一级输入
      form.firstCategoryName = params.data.category_name;
      // 存储当前数据对象
      category.current = params.data
    };
    // 删除提示框
    const deleteCategory = (categoryID, categoryName) => {
      // deleteValue.value=categoryID
      root.confirm({
        content: `确认是否删除${categoryName}？`,
        tip: "警告",
        type: "warn",
        fn: deleteFirstCategory,
        // catchFn()=>{
        //   deleteValue.value=""
        // }
        data: categoryID
      });
    };
    // 删除一级分类
    const deleteFirstCategory = categoryID => {
      DeleteCategory({ categoryId: categoryID })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
          }
          // splice(起始位，删除数目，插入)
          // let index = category.item.findIndex(item=>item.id == categoryID);
          // category.item.splice(index,1)

          let newData = category.item.filter(item => item.id != categoryID);
          category.item = newData;
          // console.log(response);
        })
        .catch(error => {});
    };
    // 确认按钮
    const submit = () => {
      // 按钮延迟
      button_loading.value = true;
      // 判断是不为空
      if (!form.firstCategoryName) {
        root.$message({
          message: "分类名称不能为空!",
          type: "error"
        });
        button_loading.value = false;
        return false;
      }

      // 提交添加一级分类
      if (submit_button_type.value === "category_first_add") {
        submitAddFirstCategory();
      }
      // 提交编辑一级分类
      if(submit_button_type.value === "category_first_exit"){
        submitEditCategory();
      }
      // 提交添加二级菜单
      if(submit_button_type.value === "category_children_add"){
        addChildrenCategory();
      }

      // 返回数据
    };
    // 提交添加二级菜单的方法
    const addChildrenCategory = ()=>{
      if (!form.secCategoryName) {
        root.$message({
          message: "子级分类名称不能为空！！",
          type: "error"
        });
        button_loading.value = false;
        return false;
      }
      let requestData = {
        categoryName:form.secCategoryName,
        parentId:category.current.id,
      }
      AddChildrenCategory(requestData).then(response=>{
          let data= response.data; 
          root.$message({
              message: "子级添加成功！！",
              type: "success"
            });
           button_loading.value = false;
           form.secCategoryName = '';
           getCategoryAll();
      }).catch(error=>{
           button_loading.value = false;
      })
    }
    // 提交编辑一级分类
    const submitEditCategory = ()=>{
      let requestData = {
        id:category.current.id,
        categoryName:form.firstCategoryName
      }
      EditCategory(requestData).then(response=>{
        let data = response.data;
        if (data.resCode === 0){
            root.$message({
              message: data.message,
              type: "success"
            })
        button_loading.value = false;
        // 两种方式
        category.current.category_name = data.data.data.categoryName;
        // let editItem = category.item.filter(item => item.id === requestData.id);
        // editItem[0].category_name = data.data.data.categoryName;
        form.firstCategoryName='';
        category.current = [];
       }
      }).catch(error=>{
        button_loading.value = false;
      })
    }
    // 提交添加一级分类方法
    const submitAddFirstCategory = () => {
      AddFirstCategory({ categoryName: form.firstCategoryName })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            // 两种处理
            // 1.请求接口获取分类接口（缺点，浪费资源）
            // 2.直接push，请求接口后返回的数据
            category.item.push(data.data);
            // getCategory();

            // 清理表格内容
            button_loading.value = false;
            form.firstCategoryName = "";
            form.secCategoryName = "";
            // refs["categoryForm"].resetFields();
          }
        })
        .catch(error => {
          button_loading.value = false;
          form.firstCategoryName = "";
          form.secCategoryName = "";
          //  refs["categoryForm"].resetFields();
        });
    };
    const addFirst = params => {
      // 清理表格内容
      form.firstCategoryName = "";
      form.secCategoryName = "";
      submit_button_type.value = params.type;
      category_sec.value = false;
      firstInput.value = false;
      buttonStatus.value = false;
    };
    // 添加二级子级
    const handleAddChildren = (params)=>{
      // 更新按钮的类型
      submit_button_type.value = params.type;
      console.log(params)
      // 存储数据
      category.current = params.data;
 
      // 打开二级输入框
      secInput.value =false;
      // 打开提交按钮
      buttonStatus.value =false;
      // 显示二级输入框
      category_sec.value = true;
      // 禁用一级输入框
      firstInput.value =true;
      form.firstCategoryName=params.data.category_name

    }
    // const getCategory = () => {
    //   GetCategory({})
    //     .then(response => {
    //       let data = response.data.data.data;
    //       category.item = data;
    //     })
    //     .catch(error => {});
    // };
    // +watch(()=>categorycommon.item,value =>{
    //   category.item = value;
    // });
    // 生命周期，页面DOM挂载完成的时候执行
    // const getCategory2 = () =>{
    //   content_loading.value = true;
    //   root.$store.dispatch('common/getCategory').then(response=>{
    //     category.item = response;
    //     content_loading.value=false;
    //   }).catch(error=>{
    //     // content_loading.value=false;
    //   })
    // }
    const getCategoryAll = () =>{
      content_loading.value = true;
      root.$store.dispatch('common/getCategoryAll').then(response=>{
        category.item = response;
        category.item.children =response.children;
        console.log(response)
        content_loading.value=false;
      }).catch(error=>{
        // content_loading.value=false;
      })
    }
    onMounted(() => {
      getCategoryAll();
   
      // +getCategorycommon();
    });

    return {
      handleAddChildren,
      editCategory,
      deleteCategory,
      secInput,
      firstInput,
      buttonStatus,
      form,
      submit,
      category_first,
      category_sec,
      addFirst,
      category,
      button_loading,
      submit_button_type,
      content_loading
    };
  }
};
</script>

<style lang="less">
.infoContent {
  height: 390px;
  overflow: auto;
}
.infoTitle {
  height: 14px;
  border-left: 1px solid #fff;
  width: 1px;
  position: absolute;
  top: 0;
  left: 24px;
}
.infoLine {
  margin-bottom: 5px;
  margin-left: -30px;
  margin-right: -30px;
  height: 5px;
  border-bottom: 1px solid #e9e9e9;
}
.infoFormItem {
  margin-top: 18px;
}

.infoInput {
  width: 200px;
}
.menu-title {
  line-height: 28px;
  height: 28px;
  background-color: #f3f3f3;
  padding-left: 22px;
  font-size: 13px;
}
.button-group {
  display: none;
  .el-button.is-round {
    height: 19px;
    line-height: 4px;
    border-radius: 20px;
    margin-top: 4px;
    margin-right: 4px;

    /* padding: 12px 23px; */
  }
  float: right;
  top: 0;
}
.button-child {
  display: none;
  .el-button.is-round {
    height: 19px;
    line-height: 6px;
    border-radius: 20px;
    margin-top: 1px;
    margin-right: 4px;

    /* padding: 12px 23px; */
  }
  float: right;
  top: 0;
}
.category {
  position: relative;
  cursor: pointer;
  font-size: 13px;
  .jiahao {
    position: absolute;
    left: 17px;
    top: 6px;
    height: 15px;
    width: 15px;
    z-index: 2;
    img {
      width: 100%;
    }
  }

  h4 {
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
    margin-left: 24px;
    height: 28px;
    line-height: 28px;
    padding-left: 16px;
    transition: all 0.5;
    border-left: 1px dotted black;
  }
  .last {
    border: none;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0px;
      height: 13px;
      border-left: 1px dotted black;
    }
  }
  li {
    &:hover {
      background-color: #f3f3f3;
      .button-child {
        display: block;
      }
    }
    transition: all 0.5;
    line-height: 25px;
    border-left: 1px dotted black;
    height: 25px;
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    box-sizing: border-box;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 13px;
      width: 32px;
      border-bottom: 1px dotted black;
    }
  }
}
</style>