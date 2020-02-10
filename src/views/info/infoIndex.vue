<template>
  <div>
    <!-- 主题栏 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="4" class="label-wrap">
          <label for>分类：</label>
          <div class="warp-content">
            <el-select v-model="category_value" placeholder="请选择" class="typeWidth" size="mini">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" class="label-wrap">
          <label for>日期：</label>
          <div class="warp-content">
            <el-date-picker
              size="mini"
              class="dateWidth"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="date_value"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="4" class="label-wrap">
          <label>关键字：</label>
          <div class="warp-content">
            <el-select v-model="keyword" class="keyWidth" size="mini">
              <el-option
                v-for="item in search_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="3" class="addPadding">
          <el-input v-model="search_keyword" placeholder="请输入内容" size="mini"></el-input>
        </el-col>
        <el-col :span="3" class="addPadding">
          <el-button type="danger" size="mini" @click="search">搜索</el-button>
        </el-col>
        <el-col :span="2" class="addPadding" style="padding-top:8px">
          <el-button type="danger" class="newAdd" size="mini" @click="dialog_info=true">新增</el-button>
        </el-col>
      </el-row>
    </el-form >
    <div class="blank-space-20"></div>
    <!-- 内容表格 -->
    <el-table :data="table_data.item" border style="width: 100%" class="infoIndexTable" v-loading="table_loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" width="330" align="center"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="100" align="center" :formatter="toType"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="200" align="center" :formatter="toDate"></el-table-column>
      <el-table-column prop="user" label="管理员" width="100" align="center" ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="blank-space-20"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="9">
        <el-button size="small" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="15">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          layout=" total, sizes,prev, pager, next"
          :total="totalItem"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <Info :flag.sync="dialog_info" :category="options.category" @emitUpdateForm="UpdateForm" />
    <!-- 编辑弹窗 -->
    <InfoEdit :flag.sync="dialog_info_edit" :category="options.category" @emitUpdateForm="UpdateForm" :rowEdit="editItem.item"/>
  </div>
</template>

<script>
// import { AddFirstCategory, GetCategory, DeleteCategory, EditCategory } from "@/api/news";
// +import {common } from "@/api/common.js"
import Info from './dialog/Info'
import InfoEdit from './dialog/edit'
import {timestampToTime} from "@/assets/js/common.js"
import { AddInfo ,GetList , DeleteInfo} from "@/api/news";
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed,
  watch
} from "@vue/composition-api";
export default {
  components:{
    Info,InfoEdit
  },
  setup(props, { root }) {
    // +const { getCategorycommon,categorycommon } = common();
    const options = reactive({
      category:[]
    });
    const editItem = reactive({
      item:{}
    })
    // 页码
    const page = reactive({
      pageNumber:1,
      pageSize:10
    })
    
    // 关键字
    const search_option = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);
    // 表格内容
    const table_data = reactive({
      item:[],
    });
    // 信息弹窗标记
    let dialog_info = ref(false);
    let dialog_info_edit = ref(false);
    let table_loading =ref(true);
    let category_value = ref("");
    let date_value = ref("");
    let keyword = ref("ID");
    let search_keyword = ref("");
    let totalItem = ref(10);
    let deleteItemId = ref('')

    // 方法
    // 编辑列表项
    const editInfo = (row)=>{
      dialog_info_edit.value= true;
      editItem.item = row;
    }
    // 转换类型
    const toType = (row)=>{
      let categoryId =row.categoryId
      let categoryData = options.category.filter(item => item.id == categoryId)[0]
      return categoryData.category_name
    }
    // 转换时间
    const toDate = (row,column,cellValue,index)=>{
      return timestampToTime(row.createDate)
    }
    // 获取列表
    const getList = ()=>{
      // let requestData = {
      //   category:'',
      //   startTime:'',
      //   endTime:'',
      //   title:'',
      //   id:'',
      //   pageNumber:page.pageNumber,
      //   pageSize:page.pageSize
      // }
       let requestData = formatData();
      GetList(requestData).then(response=>{
        let data = response.data.data;
        table_data.item = data.data;
        // 页面数量
        totalItem.value=data.total;
        table_loading.value = false;
      }).catch(error=>{
        table_loading.value = false;
      })
    }
    // 选择页面的数量
    const handleSizeChange = val => {
      page.pageSize  = val;
    };
    // 当前选中的页数
    const handleCurrentChange = val => {
      page.pageNumber= val;
      getList();
    };
    // 删除当前数据
    const deleteItem=(row)=>{
        deleteItemId.value = [row.id];
        root.confirm({content:"确认是否删除当前数据？",
                      tip:"警告",
                      type:"warn",
                      fn:thenConfirmDelete,
                      id:'111'})
    }
    // 删除选择数据
    const deleteAll=()=>{
        if(!deleteItemId.value || deleteItemId.value.length == 0){
          return false
        }
        root.confirm({content:"确认是否删除选择数据？",
                      tip:"警告",
                      type:"warn",
                      fn:thenConfirmDelete,
                      id:'222'
                    })
    }
    // 选择全选
    const handleSelectionChange = (val)=>{
      let id = val.map(item =>item.id);
      deleteItemId.value =id;
    }
    const thenConfirmDelete = ()=>{
      DeleteInfo({id:deleteItemId.value}).then(response=>{
        getList();
        deleteItemId.value = '';
      }).catch(error=>{

      })
    }
    // 搜索按钮
    const search = ()=>{
      getList();
    }
    const formatData = ()=>{
      let requestData = {
        pageNumber:page.pageNumber,
        pageSize:page.pageSize
      };
      //分类
      if(category_value.value){requestData.categoryId = category_value.value }
      // 日期
      if(date_value.value.length > 0){
        requestData.startTime = date_value.value[0]
        requestData.endTime = date_value.value[1]
      }
      //关键字
      requestData[keyword.value] = search_keyword.value;
      return requestData;
    }
    // 子级调用父级更新表格
    const UpdateForm = ()=>{
      getList();
      console.log(111)
    }
    // 获取分类数据
    // const getCategory = () => {
    //   GetCategory({})
    //     .then(response => {
    //       let data = response.data.data.data;
    //       options.category = data;
    //     })
    //     .catch(error => {});
    // };
    // watch
    // +watch(()=>categorycommon.item,value =>{
    //   options.category= value
    // });
    const getCategory2 = () =>{
      root.$store.dispatch('common/getCategory').then(response=>{
        options.category = response;
      }).catch(error=>{

      })
    }
    onMounted(()=>{
      // getCategorycommon()
      getCategory2();
      getList()
    })
    return {
      // reactive
      table_data,
      options,
      search_option,
      // ref
      dialog_info_edit,
      totalItem,
      date_value,
      search_keyword,
      dialog_info,
      keyword,
      category_value,
      // methods
      editItem,
      editInfo,
      toType, toDate,
      handleSizeChange,
      handleCurrentChange,
      deleteItem,
      deleteAll,
      table_loading,
      handleSelectionChange,
      UpdateForm,
      search
    };
  }
};
</script>

<style  lang='less' >
.infoIndexTable{
  height: 200px;
  overflow: auto;
}
.el-table--border::after, .el-table--group::after, .el-table::before {
    content: '';
    position: fixed;
    background-color: #EBEEF5;
    z-index: 1;
    /* z-index: 1; */
}
.el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
}
div.el-table {
  border: 1px solid #EBEEF5;
  th {
    font-weight: bold;
    color: #000;
    padding: 4px 0;
  }
  td {
    font-size: 11px;
    padding: 4px 0;
  }
}
.el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 13px;
}
.blank-space-20 {
  margin-top: 20px;
}
.typeWidth {
  width: 100%;
}
.dateWidth {
  width: 100% !important;
}
.keyWidth {
  width: 80px;
}
.addPadding {
  line-height: 40px;
}
.label-wrap {
  label {
    font-size: 13px;
    float: left;
    height: 40px;
    line-height: 40px;
  }
  .warp-content {
    margin-left: 40px;
    line-height: 40px;
  }
}
.newAdd {
  float: right;
  vertical-align: middle;
  height: 28px;
}
</style>