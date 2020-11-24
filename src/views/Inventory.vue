<template>
  <div class="unit-list">
    <div style="margin-bottom: 16px">
      <a-button type="primary">
        <router-link to="addNewProduct">添加新产品</router-link>
      </a-button>
      <a-popconfirm
        title="确定要删除此单品吗？"
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
      :data-source="products"
      :rowKey="(record) => record.id"
    >
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="(c) => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="() => handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <span slot="action" slot-scope="text, record">
        <router-link :to="'/editProduct/' + record.id">编辑产品</router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此产品吗？"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="confirmDelete(record.id)"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      <span slot="total" slot-scope="text">
        {{
          new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(
            text
          )
        }}
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  queryAllProduct,
  deleteProduct,
  deleteProductCategoryByProductId,
} from "@/utils/db";

export default {
  name: "ProductsList",
  data() {
    return {
      products: [],
      columns: [
        // {
        //   title: "ID",
        //   dataIndex: "id",
        //   key: "id",
        //   sorter: (a, b) => a.id - b.id,
        //   defaultSortOrder: "descend",
        // },
        {
          dataIndex: "productName",
          title: "产品名称",
          key: "name",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.productName.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          dataIndex: "unit",
          title: "单位",
          key: "unit",
        },
        {
          dataIndex: "inventory",
          title: "库存数量",
          key: "inventory",
          sorter: (a, b) => a.id - b.id,
        },
        {
          dataIndex: "total",
          title: "总价值(元)",
          key: "total",
          scopedSlots: { customRender: "total" },
          sorter: (a, b) => a.id - b.id,
        },
        {
          dataIndex: "inventoryReceived",
          title: "入库次数",
          key: "inventoryReceived",
          sorter: (a, b) => a.id - b.id,
        },
        {
          dataIndex: "inventoryShipped",
          title: "出库次数",
          key: "inventoryShipped",
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
    };
  },
  components: {},
  mounted() {
    this.getAllProduct();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    confirmDelete(productId) {
      //   console.log(productId);
      this.deleteProducts([productId]);
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getAllProduct() {
      queryAllProduct().then((data) => {
        this.products = data;
      });
    },
    confirmBulkDelete() {
      if (this.selectedRowKeys.length > 0) {
        this.deleteProducts(this.selectedRowKeys);
      } else {
        this.$message.warning("请先选择产品");
      }
    },
    deleteProducts(ids) {
      deleteProductCategoryByProductId(ids)
        .then(() => {
          return deleteProduct(ids);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.getAllProduct();
          this.selectedRowKeys = []
        })
        .catch((data) => {
          this.$message.error(data.message);
        });
    },
  },
};
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
