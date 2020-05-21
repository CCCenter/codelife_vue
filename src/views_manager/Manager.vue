<template>
  <div>
    <el-container>
      <el-header style="position: fixed; width:100%;z-index:999; background-color:#23262E;">
        <span style="color:#fff;font-size:18px;">codeadmin</span>
        <div style="float:right;color:#000;">
          <el-dropdown>
            <i class="el-icon-setting" style="color:#ccc;margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <span @click="dialogMember()">
                <el-dropdown-item>个人信息</el-dropdown-item>
              </span>
              <span @click="logout()">
                <el-dropdown-item>退出</el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
          <span style="color:#ccc">{{manager.nickName}}</span>
        </div>
      </el-header>
      <el-container style="margin-top:60px; border: 1px solid #eee">
        <el-aside width="220px" style="background-color: #fff;">
          <el-menu default-active="2" router>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-home"></i>首页
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/index_manager">首页</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-custom"></i>用户管理
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/member_manager">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-order"></i>问题管理
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/question_manager">问题列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-s-comment"></i>评论管理
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/comment_manager">评论列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-price-tag"></i>标签管理
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/tagType_manager">标签列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-s-release"></i>屏蔽词管理
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/sensitive_manager">屏蔽词列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container style=" background-color: #ecf0f1;padding : 10px 10px 0 10px">
          <router-view key v-if="RouterAlive" />
        </el-container>
      </el-container>
    </el-container>

     <el-dialog
    title="个人档案"
    :visible.sync="dialogVisible"
    width="60%"
    >
    <el-divider content-position="left">{{dialogData.nickName}}</el-divider>
    <el-container>
        <el-aside width="200px" style="border-right:#DCDFE6 1px solid;position: relative;">
            <img
            style="width: 100px; height: 100px; margin: 0 auto;"
            :src="dialogData.avatar"
            />
        </el-aside>
        <el-main>
            <el-form label-width="80px">
            <el-form-item label="用户名:">
                {{dialogData.username}}
            </el-form-item>
            <el-form-item label="昵　称:">
                {{dialogData.nickName}}
            </el-form-item>
            <el-form-item label="手机号:">
                {{dialogData.phone}}
            </el-form-item>
            <el-form-item label="创建时间:">
                {{dialogData.createTime | dataFormat("yyyy-MM-dd")}}
            </el-form-item>
            <el-form-item label="用户编号:">
                {{dialogData.id}}
            </el-form-item>
            </el-form>
        </el-main>
    </el-container>
  </el-dialog>

  </div>
</template>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
img{
      position: absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
  }
</style>
<script>
export default {
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reload: this.reload
            }
		},
  data() {
    return {
      RouterAlive: true,
      dialogData:'',
      dialogVisible: false,
      manager:{
        id:"",
        avatar:'',
        nickName:'',
      },
    };
  },
  methods: {
    reload () {
      this.RouterAlive = false;            //先关闭，
      this.$nextTick(function () {
          this.RouterAlive = true;         //再打开
      })
    },
    logout(){
      localStorage.removeItem("managerAvatar");
      localStorage.removeItem("managerId");
      localStorage.removeItem("managerNickName");
      this.$router.push('/login_manager');
    },
    dialogMember(){
      const _this = this;
      axios.get('http://localhost:8003/member/profile/'+ _this.manager.id).then(function(resp){
        _this.dialogData = resp.data.data;
        _this.dialogVisible = true;
      });
    }
  },
  created(){
    this.manager.avatar = localStorage.getItem("managerAvatar");
    this.manager.id = localStorage.getItem("managerId");
    this.manager.nickName = localStorage.getItem("managerNickName");
    if(!this.manager.nickName){
      this.$router.push('/login_manager');
    }
  }
};
</script>