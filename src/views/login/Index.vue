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
        ref="loginName"
        class="login-form"
        size="medium"
      >
        <!-- 输入用户名 -->
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="5"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- 重复密码 -->
        <el-form-item prop="passwords" class="item-form" v-if="isShow==='register'">
          <label for="repeat">重复密码</label>
          <el-input
            id="repeat"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="5"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- 输入验证码 -->
        <el-form-item prop="checkPass" class="item-form">
          <label for="validate">验证码</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input
                id="validate"
                v-model="ruleForm.checkPass"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <!-- 验证码按钮 -->
            <el-col :span="9" style="paddingLeft:0">
              <el-button
                type="success"
                class="login-btn"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginName')"
            class="login-btn"
            style="marginTop:13px"
            :disabled="loginButton"
          >{{isShow==='login' ? '登录': '注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1'
import { GetSms, Register,Login } from "@/api/login.js";
import { reactive, ref, isRef, onMounted } from "@vue/composition-api";
import {
  passwordCheck,
  emailCheck,
  validateCheck
} from "@/assets/js/validate.js";
export default {
  name: "login",
  setup(props, context) {
    //验证用户名
    var validateusername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电子邮箱"));
      } else if (emailCheck(value)) {
        callback(new Error("电子邮件地址必须包括 ( @ 和 . )"));
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
      } else if (value != ruleForm.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    //验证验证码
    var checkAge = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateCheck(value)) {
        return callback(new Error("验证错误"));
      } else {
        return callback();
      }
    };
    // ==============================================================================================
    // 声明数据
    const ruleForm = reactive({
      username: "415765280@qq.com",
      password: "123456",
      passwords: "",
      checkPass: ""
    });
    // 定时器
    const timer = ref(null);
    //验证码文本
    // const codeButtonText=ref('获取验证码')
    //验证码按钮的状态
    // const codeButtonStatus=ref(false)
    //验证码对象
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateusername, trigger: "blur" }],
      password: [{ validator: validatePass, trigger: "blur" }],
      passwords: [{ validator: validatePassword, trigger: "blur" }],
      checkPass: [{ validator: checkAge, trigger: "blur" }]
    });

    // 对象数据
    const menuTab = reactive([
      { txt: "登录", current: false, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 基础数据
    const isShow = ref("login");
    // 禁用按钮状态
    const loginButton = ref(false);
    // 声明函数
    // =================================================================================================================

    // 获取验证码
    const getSms = () => {
      if (ruleForm.username === "") {
        context.root.$message.error("邮箱不能为空");
        return false;
      }
      if (emailCheck(ruleForm.username)) {
        context.root.$message.error("邮箱格式有误，重新输入");
        return false;
      }
      // }else if(ruleForm.password === ''){
      //   context.root.$message.error('密码不能为空');
      // }else{
      GetSms({ username: ruleForm.username, module: isShow.value })
        .then(response => {
          let data = response.data;
          console.log(data);
          codeButtonStatus.status = true;
          loginButton.value = false;
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });

      //  }
    };
    // 倒计时
    const countDown = number => {
      // 判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let num = number;
      timer.value = setInterval(
        () => {
          num--;
          console.log(num);
          codeButtonStatus.text = `请稍后${num}s`;

          if (num === 0) {
            codeButtonStatus.status = false;
            clearInterval(timer.value);
            codeButtonStatus.text = "获取验证码";
          }
        },

        1000
      );
    };

    // 切换登录函数
    const togglemenu = item => {
      menuTab.forEach(obj => {
        obj.current = false;
      });
      loginButton.value = false;
      isShow.value = item.type;
      item.current = true;
      context.refs["loginName"].resetFields();
    };

    // 提交按钮函数
    const submitForm = loginName => {
      //模拟注册成功
      context.refs[loginName].validate(valid => {
        if (valid) {
          // 表单验证通过
          if (isShow.value === "login") {
             login();
            // console.log(123)
          } else {
            register();
          }

          // 注册接口
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登录
    const login = () => {
      let responseData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.checkPass
      };
      context.root.$store.dispatch('app/login',responseData)
        .then(response => { 
          // 页面跳转控制台
          clearCountDown();
          console.log('Login') 
          context.root.$router.push('/console')
          
        })
        .catch(error => {
          console.log('登录失败')
        });
      // Login(responseData)
      //   .then(response => {
      //        //页面跳转控制台
      //        clearCountDown();
      //        console.log('Login') 
      //        context.root.$router.push('/console')
          
      //   })
      //   .catch(error => {
      //     console.log('登录失败')
        // });
    };

    // 注册
    const register = () => {
      let responseData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.checkPass,
        module: "register"
      };
      Register(responseData)
        .then(response => {
          togglemenu(menuTab[0]);
          clearCountDown();
          console.log(response);
        })
        .catch(error => {});
    };
    // 清除倒计时
    const clearCountDown = () => {
      clearInterval(timer.value);
      codeButtonStatus.status = false;
      codeButtonStatus.text = "获取验证码";
    };
    // =======================================================================================================
    // 生命周期
    onMounted(() => {});
    return {
      menuTab,
      isShow,
      submitForm,
      togglemenu,
      ruleForm,
      rules,
      getSms,
      loginButton,
      codeButtonStatus
    };
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