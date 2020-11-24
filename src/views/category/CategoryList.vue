<template>
  <div class="category">
    <div style="margin-bottom: 16px">
      <a-button type="primary">
        <router-link to="addNewCategory">添加新分类</router-link>
      </a-button>
      <a-popconfirm
        title="确定要删除此分类吗？"
        ok-text="Yes"
        cancel-text="No"
        v-on:confirm="confirmBulkDelete()"
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
      :data-source="categories"
      :rowKey="(record) => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <router-link :to="'/category/' + record.id">编辑分类</router-link>
        <a-divider type="vertical" />
        <router-link :to="'/categoryProduct/' + record.id">编辑分类产品</router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此分类吗？"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="confirmDelete(record.id)"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { queryAllCategory, deleteCategory, deleteCategoryProduct } from "@/utils/db";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: "descend",
  },
  {
    dataIndex: "categoryName",
    title: "分类名称",
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
      categories: [],
      columns,
      selectedRowKeys: [],
    };
  },
  components: {},
  mounted() {
    this.getAllCategories();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    confirmDelete(categoryId) {
      // console.log(categoryId);
      this.deleteCategories([categoryId]);
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getAllCategories() {
      queryAllCategory().then((data) => {
        this.categories = data;
      });
    },
    confirmBulkDelete() {
      if (this.selectedRowKeys.length > 0) {
        this.deleteCategories(this.selectedRowKeys);
      } else {
        this.$message.warning("请先选择分类");
      }
    },
    deleteCategories(ids) {
      deleteCategoryProduct(ids).then(()=>{return deleteCategory(ids)}).then(() => {
        this.$message.success("删除成功");
        this.getAllCategories();
        this.selectedRowKeys = []
      }).catch((err)=>{
        this.$message.error(err.message)
      });
    },
  },
};
</script>

<style>
</style>
