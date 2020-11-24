<template>
  <div class="category">
    <div style="margin-bottom: 16px">
      <a-popconfirm
        title="确定要删除出库单吗？"
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
      <span style="margin-left: 8px;margin-right: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
      <a-range-picker
        :ranges="{
          Today: [moment().startOf('day'), moment().endOf('day')],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')],
        }"
        @change="selectDate"
      />
      <span style="margin-left: 8px; margin-right: 8px">
        <template v-if="summary">
          {{ `总计: ${summary} 元` }}
        </template>
      </span>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="outstorage"
      :rowKey="(record) => record.id"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
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
        <a-popconfirm
          title="确定要删除此条信息吗？"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="confirmDelete(record.id)"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      <span slot="orderDate" slot-scope="text">
        {{ moment(text * 1000).format("YY-M-D HH:m") }}
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { queryAllOrder, deleteOrder, getOrderTotal, restoreInventory, getOrder } from "@/utils/db";
import moment from "moment";

export default {
  name: "outList",
  data() {
    return {
      outstorage: [],
      columns: [
        // {
        //   dataIndex: "id",
        //   title: "id",
        //   key: "id",
        // },
        {
          dataIndex: "orderDate",
          title: "出库时间",
          key: "orderDate",
          scopedSlots: { customRender: "orderDate" },
          sorter: (a, b) => a.id - b.id,
          defaultSortOrder: "descend",
        },
        {
          dataIndex: "productName",
          title: "产品名称",
          key: "productName",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.productName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          dataIndex: "numberConsumed",
          title: "出库数量",
          key: "numberConsumed",
        },
        {
          dataIndex: "avgPrice",
          title: "均价",
          key: "avgPrice",
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      moment,
      pagination: {
        showSizeChanger: true,
      },
      total:null,
      loading: false,
      selectedRowKeys: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      dateFormat: "YYYY/MM/DD",
      monthFormat: "YYYY/MM",
      dateLimit:[],
      summary:0,
    };
  },
  components: {},
  mounted() {
    this.getAllOrder();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    selectDate(dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
      if(dates.length > 0){
        this.dateLimit = [dates[0].unix(),dates[1].unix()]
      }else{
        this.dateLimit = []
      }
      this.getAllOrder()
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getAllOrder({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    confirmDelete(purchaseId) {
      // console.log(purchaseId);
      this.deleteOrders([purchaseId]);
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getAllOrder(
      params = {
        results: 10,
        page: 1,
        sortField: "orderDate",
        sortOrder: "descend",
      }
    ) {
      params.dateLimit = this.dateLimit
    //   console.log("params:", params);
      this.loading = true;
      getOrderTotal(params)
        .then((orderSummary) => {
          this.total = orderSummary.total?orderSummary.total:0;
          this.summary = orderSummary.summary?orderSummary.summary:0;
          queryAllOrder(params).then((data) => {
            const pagination = { ...this.pagination };
            // Read total count from server
            pagination.total = this.total;
            this.loading = false;
            this.outstorage = data;
            this.pagination = pagination;
          });
        })
        .catch((err) => this.$message.error(err.message));
    },
    confirmBulkDelete() {
      if (this.selectedRowKeys.length > 0) {
        this.deleteOrders(this.selectedRowKeys);
      } else {
        this.$message.warning("请先选择需要删除的条目");
      }
    },
    deleteOrders(ids) {
      let all = []
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        all.push(getOrder(id).then((order)=>{
          if(order){
            return restoreInventory({productNumber:order.numberConsumed, productId: order.productId})
          }
        }).then(()=>{
          return deleteOrder([id])
        }))
      }
      Promise.all(all).then(() => {
          this.$message.success("删除成功");
          this.getAllOrder();
          this.selectedRowKeys = []
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
};
</script>

<style>
</style>
