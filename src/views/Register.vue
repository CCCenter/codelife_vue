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
                            <el-form :model="userForm" status-icon ref="userForm" label-width="100px" class="demo-ruleForm">
                                    <el-form-item label-width="0" prop="username"
                                    :rules="[
                                        { required: true, message: '用户名不能为空'},
                                    ]">
                                        <el-input type="text"  placeholder="输入用户名" v-model="userForm.username" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label-width="0" prop="password"  :rules="[
                                        { required: true, message: '密码不能为空'},
                                    ]">
                                        <el-input type="password"  placeholder="输入密码" v-model="userForm.password" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label-width="0" prop="phone"
                                    :rules="[
                                        { required: true, message: '手机号不能为空'},
                                        { type: 'number', message: '手机号必须为数字值'}
                                    ]">
                                        <el-input placeholder="输入手机号" v-model.number="userForm.phone" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <div>
                                    <el-form-item label-width="0" prop="phoneCode"
                                     :rules="[
                                        { required: true, message: '验证码不能为空'},
                                    ]">
                                        <el-input placeholder="请输入验证码" validate-event v-model="userForm.phoneCode" prop="checkCode" class="input-with-select">
                                            <el-button slot="append" :disabled="isDisable" @click="sendCode" >{{buttonName}}</el-button>
                                        </el-input>
                                    </el-form-item>
                                    
                                    </div>
                                    <el-checkbox style="margin: 10px; 0" v-model="checked">阅读并同意以下服务条款和协议</el-checkbox>
                                    <el-button style="width: 300px;" :disabled="!checked" type="primary" @click="submitForm('userForm')">注册</el-button>
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
      return {
        isDisable:false,
        checked: false,
        buttonName:'短信验证',
        userForm: {
            username:'',
            password:'',
            phone: '',
            phoneCode:'',
        },
      };
    },
    methods: {
        sendCode(){
            const _this = this;
            alert(_this.userForm.phone)
            if(_this.userForm.phone){
                axios.post('http://localhost:8003/member/phoneCheck',_this.userForm).then(function(resp){
                    console.log(resp);
                    if(resp.data.code == 200){
                        _this.dataisDisable=true;
                        _this.buttonName = 60;
                        var id = setInterval(function(){ _this.buttonName = _this.buttonName - 1;
                        console.log(_this.buttonName);
                        if(_this.buttonName <= 0){
                            clearInterval(id);
                            _this.dataisDisable=false;
                            _this.buttonName='短信验证';
                        }
                        }, 1000);
                    }else{
                        _this.$notify.error({
                            title: '错误',
                                message: resp.data.message,
                            });
                    }
                });
            }
        },
        submitForm(formName) {
          const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('http://localhost:8003/member/create',_this.userForm).then(function(resp){
                        console.log(resp);
                        if(resp.data.code == 200){
                            _this.$notify.success({
                                title: '成功',
                                message: "注册成功",
                            });
                        }else{
                            _this.$notify.warning({
                                title: '警告',
                                message: resp.data.message,
                            });
                        }
                        
                    });
                }
            })
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