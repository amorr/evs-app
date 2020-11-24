<template>
  <div class="unit-list">
    <div style="margin-bottom: 16px">
      <a-button type="primary">
        <router-link to="addNewUnit">添加新单位</router-link>
      </a-button>
      <a-popconfirm
        title="确定要删除此单位吗？"
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
      :data-source="units"
      :rowKey="(record) => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <router-link :to="'/unit/' + record.id">编辑单位</router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此单位吗？"
          ok-text="Yes"
          cancel-text="No"
          v-on:confirm="confirmDelete(record.id)"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      <span slot="decimalallowed" slot-scope="text">
        {{ text ? "是" : "否" }}
      </span>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { queryAllUnit, checkUnit, deleteUnit } from "@/utils/db";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: "descend",
  },
  {
    dataIndex: "unitName",
    title: "单位名称",
    key: "name",
  },
  {
    dataIndex: "decimalAllowed",
    title: "是否允许使用小数",
    key: "decimalAllowed",
    scopedSlots: { customRender: "decimalallowed" },
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "UnitList",
  data() {
    return {
      units: [],
      columns,
      selectedRowKeys: [],
    };
  },
  components: {},
  mounted() {
    this.getAllunits();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    confirmDelete(unitId) {
    //   console.log(unitId);
      this.deleteUnits([unitId]);
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getAllunits() {
      queryAllUnit().then((data) => {
        this.units = data;
      });
    },
    confirmBulkDelete() {
      if (this.selectedRowKeys.length > 0) {
        this.deleteUnits(this.selectedRowKeys);
      } else {
        this.$message.warning("请先选择单位");
      }
    },
    deleteUnits(ids) {
      checkUnit(ids)
        .then(()=>{return deleteUnit(ids)})
        .then(() => {
          this.$message.success("删除成功");
          this.getAllunits();
          this.selectedRowKeys = []
        })
        .catch((data) => {
          if (data.length > 0) {
            this.$message.error(
              data[0].productName + "还使用此单位，请先更改产品的单位",
              5
            );
          }
        });
    },
  },
};
</script>

<style>
</style>
