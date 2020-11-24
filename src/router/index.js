import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Inventory from '../views/Inventory.vue'
import CategoryList from '../views/category/CategoryList.vue'
import Category from '../views/category/Category.vue'
import AddNewCategory from '../views/category/AddNewCategory.vue'
import CategorCyProduct from '../views/category/CategorCyProduct.vue'
import AddProductToCategory from '../views/category/AddProductToCategory.vue'
import UnitList from '../views/unit/UnitList.vue'
import AddNewUnit from '../views/unit/AddNewUnit.vue'
import EditUnit from '../views/unit/EditUnit.vue'
import AddNewProduct from '../views/products/AddNewProduct.vue'
import EditProduct from '../views/products/EditProduct.vue'
import PurchaseList from '../views/inout/PurchaseList.vue'
import OutList from '../views/inout/OutList.vue'
import Summary from '../views/statics/Summary.vue'
import SalesStatic from '../views/statics/SalesStatic.vue'
import PurchaseTotal from '../views/statics/PurchaseTotal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/summary',
    name: 'summary',
    component: Summary
  },
  {
    path: '/salesstatic',
    name: 'salesstatic',
    component: SalesStatic
  },
  {
    path: '/purchasetotal',
    name: 'purchasetotal',
    component: PurchaseTotal
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: Inventory
  },
  {
    path: '/categoryList',
    name: 'categoryList',
    component: CategoryList
  },
  {
    path:'/addNewCategory',
    name: 'addNewCategory',
    component: AddNewCategory
  },
  {
    path: '/category/:id',
    name: 'category',
    component: Category
  },
  {
    path: '/categoryProduct/:id',
    name: 'categoryProduct',
    component: CategorCyProduct
  },
  {
    path: '/addProductToCategory/:id',
    name: 'addProductToCategory',
    component: AddProductToCategory
  },
  {
    path: '/unitList',
    name: 'unitList',
    component: UnitList
  },
  {
    path: '/unit/:id',
    name: 'editUnit',
    component: EditUnit
  },
  {
    path: '/addNewUnit',
    name: 'addNewUnit',
    component: AddNewUnit
  },
  {
    path:'/addNewProduct',
    name: 'addNewProduct',
    component: AddNewProduct
  },
  {
    path: '/editProduct/:id',
    name: 'editProduct',
    component: EditProduct
  },
  {
    path:'/purchaseList',
    name: 'purchaseList',
    component: PurchaseList
  },
  {
    path:'/outList',
    name: 'outList',
    component: OutList
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
