<template>
  <router-view :key="$route.fullPath" v-if="isRouterAlive"/>
</template>

<script>
export default {
	  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reload: this.reload
            }
		},
		data() {
            return{
                isRouterAlive: true                    //控制视图是否显示的变量
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                })
            }
        },

}
</script>
<style>
	body{
		margin: 0;
		padding: 0;
	}
</style>
