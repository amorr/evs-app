<template>
  <div class="category">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      :title="headerTitle"
      sub-title=""
      @back="() => $router.go(-1)"
    ></a-page-header>
    <div style="margin-bottom: 16px">
        <a-button
          type="primary"
          :disabled="!hasSelected"
          style="margin-left: 10px"
          @click="handleAddProductsToCategory"
        >
          加入分类
        </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="products"
      :rowKey="(record) => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="添加到分类"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="handleAdd([record.id])"
        >
          <a href="#">添加</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { queryAllProductByCategory, getCategory, addProductToCategory } from "@/utils/db";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: "descend",
  },
  {
    dataIndex: "productName",
    title: "产品名称",
    key: "name",
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "Category",
  data() {
    return {
      columns,
      selectedRowKeys: [],
      headerTitle:null,
      categoryId:null,
      products:[]
    };
  },
  components: {},
  mounted() {
    this.categoryId = this.$route.params.id
    getCategory(this.categoryId).then((data)=>{
      this.headerTitle = "添加产品到"+ data.categoryName +"分类"
    })
    this.getAllProduct();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getAllProduct() {
      queryAllProductByCategory(this.categoryId).then((data) => {
        this.products = data;
      });
    },
    handleAddProductsToCategory() {
      if (this.selectedRowKeys.length > 0) {
        this.handleAdd(this.selectedRowKeys);
      } else {
        this.$message.warning("请先选择产品");
      }
    },
    handleAdd(ids) {
      addProductToCategory(ids,this.categoryId).then(() => {
        this.$message.success("添加成功");
        this.getAllProduct();
      });
    },
  },
};
</script>

<style>
</style>
