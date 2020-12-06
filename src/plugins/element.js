import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Tag,
  Dialog,
  Select,
  Option,
  Tree,
  TabPane,
  Timeline,
  TimelineItem
} from 'element-ui'

// import Timeline from './timeline/index.js'
// import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.prototype.$message = Message
// Vue.prototype.$confirm = MessageBox.confirm