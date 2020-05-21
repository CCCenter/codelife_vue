<template>
	<div class="body">
		<el-container>
			<el-row >
				<el-header style="background-color:#499ef3; height:60px">
					<router-link to="/index">
						<el-col :xs="{span:2}" :sm="{span:2,offset:3}" style="height: 60px;">
							<img src="../img/logo.png" style="width:80px;padding-top:10px" />
						</el-col>
					</router-link>

					<el-col :span="4" class="hidden-md-and-down">
						<el-autocomplete
							class="input"
							v-model="keyword"
							:fetch-suggestions="querySearch"
							placeholder="请输入内容"
							:trigger-on-focus="false"
							@select="handleSelect"
							@input="input"
							>
							<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						</el-autocomplete>
					</el-col>

					<el-col :span="4" class="hidden-md-and-down">
						<el-menu
						class="el-menu-demo"
						mode="horizontal"
						@select="handleSelect"
						background-color="#499ef3"
						text-color="#fff"
						active-text-color="#ffd04b"
						router
						>
						<el-menu-item index="/index">首页</el-menu-item>
						</el-menu>
					</el-col>

					<el-col :xs="{span:4,offset:18}" :sm="{span:4,offset:13}" :md="{span:4,offset:13}" :lg="{span:4,offset:5}">
						<router-link v-if="member.id == null || member.id == '' " to='/login' class="login">
							登陆
						</router-link>
						<div v-else>
							<el-avatar shape="square" style="vertical-align:middle;" :size="30" :src="member.avatar"></el-avatar>
							<el-dropdown>
								<span class="el-dropdown-link">
									<span style="cursor: pointer;margin-left: 12px; color:#fff; font-size:16px;">{{member.nickname}}</span>
								</span>
								<el-dropdown-menu slot="dropdown">
									<router-link style=" text-decoration: none;" :to="{path:'/member/'+ member.id}">
										<el-dropdown-item icon="el-icon-user">个人主页</el-dropdown-item>
									</router-link>
									<router-link style=" text-decoration: none;" to='/publish'>
										<el-dropdown-item icon="el-icon-plus">发布问题</el-dropdown-item>
									</router-link>
									<span  @click="logout()">
										<el-dropdown-item icon="el-icon-close">退出</el-dropdown-item>
									</span>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-col>
				</el-header>
			</el-row>
			<el-row class="contents">
				<el-col :sm="{span:21,offset:3}">
					<div v-for="(item, index) in contents" :key = index>{{ item.chinese }}</div>
				</el-col>
			</el-row>
			<el-backtop :bottom="100">
				<div style="{
						height: 100%;
						width: 100%;
						background-color: #f2f5f6;
						box-shadow: 0 0 6px rgba(0,0,0, .12);
						text-align: center;
						line-height: 40px;
						color: #1989fa;
					}">
					up
				</div>
			</el-backtop>
			<el-row>
			<router-view/>
			</el-row>
    		<el-footer>Copyright © 2020· CC BY-NC-SA 3.0 · CodeLife中文社区 · 服务器赞助: XXX · 网站程序: WeCenter · 湘ICP备XXXXXXX号</el-footer>
		</el-container>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css';


export default {
	inject:['reload'],
	name : "index",
	data (){
		return {
			keyword:'',
			contents:[],
			member:{
				id:'',
				nickname:'',
				avatar:'',
			},
		}
	},
	methods : {
		createList() {
          const _this = this;
          let myArray=[];
          axios.get("api?&wd=" + _this.keyword +'&cb=sug').then(function(resp){
            var str = resp.data.substr(4,(resp.data.length-6));
            var jsonObj = eval('(' + str+ ')');
            for (let i = 0; i <  jsonObj.s.length; i++) {
              const element = jsonObj.s[i];
              var obj = {"value":element};
              myArray.push(obj);
            }
          });
          setTimeout(() => {
            this.list = JSON.parse(JSON.stringify(myArray));
          }, 500);
      },
      querySearch(queryString, cb) {
        const _this = this;
        this.createList();
        setTimeout(() => {
            cb(_this.list);
          }, 500);
        // 调用 callback 返回建议列表的数据
	  },
	  input(){
        this.restaurants = this.list;
      },
		search(){
			if(this.keyword == '' || this.keyword == null){
				this.$router.push('search');
				return;
			}
			this.$router.push({name: 'index', query: {keyword: this.keyword}});
			this.reload();
      	},
		handleSelect(key, keyPath) {
			console.log(key, keyPath);
		},
		logout(){
			localStorage.removeItem("token");
			localStorage.removeItem("avatar");
			localStorage.removeItem("id");
			localStorage.removeItem("nickName");
			this.reload();
			this.$notify({
				title:"注销成功",
				type: 'success',
				offset: 100,
				duration : 1000,
            });
		},
	},created(){
		this.member.avatar=localStorage.getItem("avatar");
		this.member.id=localStorage.getItem("id");
		this.member.nickname=localStorage.getItem("nickName");
	},
}
</script>
<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .login{
	  text-decoration: none;
	  color: #fff;
  }
  .contents{
	  background-color: #3b4045;
	  color: #fff;
  }
</style>