import Vue from 'vue'
import App from './App.vue'
import { initTable } from './utils/db'
import router from './router'
import { Layout,Menu,Icon,Form,Input,Select,Button,Collapse, Notification, Checkbox, Card, Cascader, InputNumber, DatePicker, Table, Divider, Tag, Message, PageHeader, Popconfirm } from 'ant-design-vue';

Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Input)
Vue.use(Select)
Vue.use(Button)
Vue.use(Collapse)
Vue.use(Checkbox)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(PageHeader)
Vue.use(Popconfirm)
Vue.prototype.$notification = Notification
Vue.prototype.$message = Message
Vue.config.productionTip = false

initTable()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
