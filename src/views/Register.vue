<template>
        <div class="main">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>注册</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                    <el-container>
                    <el-main>
                        <div class="login-left">
                            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                    <el-form-item label-width="0" prop="pass">
                                        <el-input type="text"  placeholder="输入用户名" v-model="ruleForm.username" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label-width="0" prop="pass">
                                        <el-input type="password"  placeholder="输入密码" v-model="ruleForm.password" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label-width="0" prop="phone">
                                        <el-input placeholder="输入手机号" v-model="ruleForm.phone" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <div>
                                        <el-input placeholder="请输入验证码" v-model="ruleForm.checkCode" prop="checkCode" class="input-with-select">
                                            <el-button slot="append">短信验证</el-button>
                                        </el-input>
                                    </div>
                                    <el-checkbox style="margin: 10px; 0" v-model="checked">阅读并同意以下服务条款和协议</el-checkbox>
                                    <el-button style="width: 300px;" :disabled="!checked" type="primary" @click="submitForm('ruleForm')">注册</el-button>
                            </el-form>
                        </div>
                    </el-main>
                    <el-aside class="login-right">
                        <h3 >其他登录方式</h3>
                        <div>
                            <a href="#" class="login-other">微博登录</a>
                            <a href="#" class="login-other">Github登录</a>
                        </div>
                    </el-aside>
                </el-container>
                <el-container class="login-footer">
                    <span>已有账号!
                        <router-link to='/login' class="login">
							立即登录
						</router-link>
                    </span>
                </el-container>
            </el-card>
            <div class="_bg"></div>
        </div>
</template>
<script>
export default {
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else {
                callback();
            }
        };

      return {
        checked: false,
        ruleForm: {
            username:'',
            password:'',
            phone: '',
            checkCode:'',
        },
        rules: {
            phone: [
                { validator: validatePhone, trigger: 'blur' }
            ],
        }
      };
    },
    methods: {
      submitForm(formName) {
          
      },
    }
  }
</script>
<style scoped>
  ._bg {
        z-index: -1;
        bottom: 0;
        background-repeat: no-repeat;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-position: 50% 100%;
        background-size: cover;
        background-image: url(../img/slot1.jpg);
    }
    .body{
      background-color: #f5f6f7;
    }
    .box-card{
        width: 700px;
        margin: 0 auto;
    }
    .main{
        padding: 10% 0 ;
        width:100%;
        height: 100%;
        background-image: url(../img/slot1.jpg);
        background-repeat: no-repeat;
        -moz-background-size: cover; /*背景图片拉伸以铺满全屏*/
        -ms-background-size: cover;
        -webkit-background-size: cover;
        background-size:100% auto;
    }
    .login-left{
        width: 300px;
        display: inline-block;
    }
    .login-right{
       border-left: 1px solid #c2c2c2;
       text-align: center;
    }
    .login-button{
       display: inline-block;
       margin: 0 15px 15px;
    }
    .login-other{
        display: block;
        width: 100px;
        height: 25px;
        background-color: #66b1ff;
        margin-left: 100px;
        margin-bottom: 15px;
        text-decoration:none;
        color: #000;
        padding: 5px;
    }
    .login-footer{
        background-color: #f5f5f5;
        height: 70px;
        padding: 25px;
        font-size: 12px;
    }
    .login-footer a{
        text-decoration: none;
        color: #66b1ff;
    }
</style>