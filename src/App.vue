<template>
  <a-layout id="app" class="layout">
    <a-layout-header>
      <div class="logo">
        <img :src="logoSource" alt="logo">
      </div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['home']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="home">
          <a-icon type="home" />
          <router-link to="/">HOME</router-link>
        </a-menu-item>
        <a-menu-item key="inventory">
          <a-icon type="bank" />
          <router-link to="/inventory">库存</router-link>
        </a-menu-item>
        <a-menu-item key="incoming">
          <a-icon type="import" />
          <router-link to="/purchaseList">采购</router-link>
        </a-menu-item>
        <a-menu-item key="shipped">
          <a-icon type="export" />
          <router-link to="/outList">出库</router-link>
        </a-menu-item>
        <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper"
          ><a-icon type="fund" />统计</span>
          <a-menu-item key="summary">
            <router-link to="summary">总计</router-link>
        </a-menu-item>
          <a-menu-item key="sales">
          <router-link to="salesstatic">销量</router-link>
        </a-menu-item>
        <a-menu-item key="purchasetotal">
          <router-link to="purchasetotal">采购总计</router-link>
        </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title" class="submenu-title-wrapper"
          ><a-icon type="setting" theme="filled" />管理</span
        >
             <a-menu-item key="categoryList">
               <router-link to="/categoryList">分类</router-link>
             </a-menu-item>
             <a-menu-item key="unitList">
               <router-link to="/unitList">单位</router-link>
             </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-header>
    <a-layout-content>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <router-view/>
      </div>
    </a-layout-content>
  </a-layout>

</template>
<script>
export default {
  name:"appvue",
  data(){
    return {
      logoSource:require('./assets/icon.png')
    }
  }
}
</script>
<style>
#app .logo {
  width: 60px;
  height: 31px;
  margin: 0 24px 16px 0;
  float: left;
}

.logo img{
  width: 100%;
}

.ant-menu-horizontal > .ant-menu-item > a{
  display: inline;
}
</style>
