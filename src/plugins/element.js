import Vue from 'vue'
import { Button, Card, Checkbox, Col, Form, FormItem, 
         Input, Link, Row, TabPane, Tabs, Message, Container,
         Header, Aside, Menu, MenuItem, MenuItemGroup, Icon, 
         Submenu, Main, Breadcrumb, BreadcrumbItem, Avatar, 
         Dropdown, DropdownMenu, DropdownItem, Loading, 
         Skeleton, SkeletonItem, Table, TableColumn, Pagination,
         Select, Dialog, Option, Divider, Timeline, TimelineItem, 
         Popconfirm, Popover, DatePicker, TimePicker, Image, Tag, 
         Switch, Drawer, Tree, Progress } from 'element-ui'

Vue.use(Card)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Row)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Col)
Vue.use(Link)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Icon)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Loading)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Divider)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Image)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Drawer)
Vue.use(Tree)
Vue.use(Progress)

Vue.prototype.$message = Message
// Vue.prototype.$openLoading = () => {
//     lock: true,
//     text: '正在努力加载中,请稍等',
    
// }