<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{'current':item.current}"
          v-for="(item,index) in menuTab"
          :key="index"
          @click="togglemenu(item)"
        >{{item.txt}}</li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
      <!-- 输入用户名 -->
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="5" maxlength='20'></el-input>
        </el-form-item>
        <!-- 重复密码 -->
        <el-form-item prop="passwords" class="item-form" v-show="isShow==='login'">
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="5" maxlength='20'></el-input>
        </el-form-item>
        <!-- 输入验证码 -->
        <el-form-item prop="checkPass" class="item-form">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input v-model.number="ruleForm.checkPass" minlength="6" maxlength="6"></el-input>
            </el-col>
            <!-- 验证码按钮 -->
            <el-col :span="9" style="paddingLeft:0">
              <el-button type="success" class="login-btn">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn" style="marginTop:13px">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { passwordCheck,emailCheck,validateCheck} from '@/assets/js/validate.js'
export default {
  name: "login",
  data() {
    
    //验证用户名
    var validateusername = (rule, value, callback) => {
      if(value===''){
        callback(new Error('请输入电子邮箱'))
      }else if(emailCheck(value)) {
        callback(new Error("电子邮件地址必须包括 ( @ 和 . )"))
      } else {
        callback();
      }
    };
    //验证密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (passwordCheck(value)) {
        callback(new Error("密码必须由5-19个数字、字母或下划线组成"));
      } else {
        callback();
      }
    };
    //验证重复密码
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value!=this.ruleForm.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    //验证验证码
    var checkAge = (rule, value, callback) => {
      
      if (value==='') {
        return callback(new Error("请输入验证码"));
      }else if(validateCheck(value)){
        return callback(new Error('验证错误'))
      }else{
        return callback()
      }
    }
    return {
      //显示重复密码
      isShow:'register',
      menuTab: [
        { txt: "登录", current: false ,type:'register'},
        { txt: "注册", current: false ,type:'login' }
      ],
      ruleForm: {
        username: "",
        password: "",
        passwords: "",
        checkPass: "",
        
      },
      rules: {
        username: [{ validator: validateusername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwords: [{ validator: validatePassword, trigger: "blur" }],
        checkPass: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    togglemenu(item) {
      this.menuTab.forEach(obj => {
        obj.current = false;
      });
      this.isShow=item.type;
      item.current = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
#login {
  height: 100%;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: 0 auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    color: #fff;
    font-size: 14px;
  }
  .item-form {
    margin-bottom: 13px;
  }
}
.login-btn {
  display: block;
  text-align: center;
  width: 100%;
}
</style>