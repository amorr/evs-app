<template>
  <div class="category">
          <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      :title="categoryName"
      sub-title="分类下的产品"
      @back="() => $router.go(-1)"
    ></a-page-header>
    <div style="margin-bottom: 16px">
      <a-button type="primary">
        <router-link :to="'/addProductToCategory/' + categoryId">添加产品到分类</router-link>
      </a-button>
      <a-popconfirm
        title="将这些产品从分类中删除吗？（并不会删除产品）"
        ok-text="Yes"
        cancel-text="No"
        v-on:confirm="DeleteManyProductFromCategory()"
      >
        <a-button
          type="primary"
          :disabled="!hasSelected"
          style="margin-left: 10px"
        >
          删除
        </a-button>
      </a-popconfirm>
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
      :rowKey="(record) => record.productId"
    >
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="是否将此产品从分类中删除？"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="hanleDelete([record.productId])"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { deleteProductFromCategory, queryAllProductInCategoryByCategorytId, getCategory } from "@/utils/db";
const columns = [
  {
    title: "ID",
    dataIndex: "productId",
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
  name: "CategoryProduct",
  data() {
    return {
      products: [],
      columns,
      selectedRowKeys: [],
      categoryId:null,
      categoryName:null
    };
  },
  components: {},
  mounted() {
      this.categoryId = this.$route.params.id
      getCategory(this.categoryId).then((data)=>{
        this.categoryName = data.categoryName
      })
    this.getAllProducts();
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
    getAllProducts() {
      queryAllProductInCategoryByCategorytId(this.categoryId).then((data) => {
        this.products = data;
      });
    },
    DeleteManyProductFromCategory() {
    //   console.log("delete many rows");
      if (this.selectedRowKeys.length > 0) {
        this.hanleDelete(this.selectedRowKeys, this.categoryId);
      } else {
        this.$message.warning("没有选择分类");
      }
    },
    hanleDelete(productIds) {
      deleteProductFromCategory(productIds, this.categoryId).then(() => {
        this.$message.success("删除成功");
        this.getAllProducts();
        this.selectedRowKeys = []
      }).catch((err)=>{this.$message.error(err.message)});
    },
  },
};
</script>

<style>
</style>
