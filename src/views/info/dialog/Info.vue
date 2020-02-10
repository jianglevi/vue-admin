<template>
  <el-dialog
    title="新增"
    :visible.sync="dialog_info"
    :modal-append-to-body="false"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="form" >
      <el-form-item label="类型：" :label-width="formLabelWidth">
        <el-select v-model="form.category" placeholder="选择喜欢的类型">
          <el-option
            v-for="item in categoryOption.item"
            :label="item.category_name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" @click="submit" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo ,GetList} from "@/api/news";
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed,
  watch
} from "@vue/composition-api";
export default {
  name: "Info",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root, emit, }) {
    //   ref
    const submitLoading = ref(false);
    const dialog_info = ref(false);
    const formLabelWidth = ref("70px");
    // reactive
    const form = reactive({
      category: "",
      title: "",
      content: ""
    });
    const categoryOption = reactive({
      item: []
    });
    // watch
    watch(() => (dialog_info.value = props.flag));
    // methods
    // 提交确认
    const submit = () => {
      submitLoading.value = true;
      let requestData = {
        category: form.category,
        title: form.title,
        content: form.content
      };
      if(!form.category){
        root.$message({
              message: '类型不能为空！！',
              type: "error"
            }); 
        submitLoading.value = false;
        return false
      }
      AddInfo(requestData)
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            }); 
            clearForm();
            emit("emitUpdateForm")
          }
          submitLoading.value = false;
        })
        .catch(error => {
          submitLoading.value = false;
        });
      
    };
    // 清除内容
    const clearForm = () => {
      form.category = "";
      form.title = "";
      form.content = "";
    };

    // 对话框关闭
    const close = () => {
      emit("update:flag", false);
      clearForm();
      // this.$emit("emitClose")
    };
    // 对话框打开
    const openDialog = () => {
      categoryOption.item = props.category;
      // console.log(props.category);
    };
    // 返回数据
    return {
      close,
      form,
      dialog_info,
      formLabelWidth,
      openDialog,
      categoryOption,
      submit,
      submitLoading
    };
  }
};
</script>

<style  lang="less">
.el-form {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
.el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;
  button {
    width: 150px;
    margin: 0 11px;
  }
}
</style>