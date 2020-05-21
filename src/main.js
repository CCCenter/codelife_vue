import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import showdown from 'showdown'

//用于正确显示md文件
Vue.prototype.md2html = (md)=> {
  let converter = new showdown.Converter()
  let text = md.toString()
  let html = converter.makeHtml(text)
  return html
}

Vue.config.productionTip = false

  
  const
  s = 1000,
  m = 60 * s,
  h = 60 * m,
  d = 24 * h,
  mo = 30 * d,
  y = 365 * d
  
  const fdate = [
  {
    time: y,
    text: '年'
  }, {
    time: mo,
    text: '月'
  }, {
    time: d,
    text: '天'
  }, {
    time: h,
    text: '小时'
  }, {
    time: m,
    text: "分钟"
  }, {
    time: s,
    text: '秒'
  }
  ]

Vue.filter('formatData', function (value) {

  const time = Date.now() - new Date(value)
  for (let i = 0; i < fdate.length; i++) {
    const t = time / fdate[i].time
    if (t >= 1) {
      return Math.floor(t) + fdate[i].text + '前';
    }
  }
})

Vue.filter('memberDate', function (value) {

  const time = Date.now() - new Date(value)
  for (let i = 0; i < fdate.length; i++) {
    const t = time / fdate[i].time
    if (t >= 1) {
      return Math.floor(t) + fdate[i].text;
    }
  }
})

Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value);
  let o = {
  'M+': getDate.getMonth() + 1,
  'd+': getDate.getDate(),
  'h+': getDate.getHours(),
  'm+': getDate.getMinutes(),
  's+': getDate.getSeconds(),
  'q+': Math.floor((getDate.getMonth() + 3) / 3),
  'S': getDate.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
  fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
  if (new RegExp('(' + k + ')').test(fmt)) {
   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  }
  return fmt;
 });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
