<template>
  <a-form
    :form="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 12 }"
    @submit="handleSubmit"
  >
    <a-form-item label="产品">
      <CascaderProduct v-on:select-product="showUnit" />
    </a-form-item>
    <a-form-item
      label="数量"
      :validate-status="validateStatus"
      :help="checkNumberNotice"
    >
      <a-input-number
        id="productNumber"
        v-model="productNumber"
        @change="changeNumber"
      />
      {{ unit }}
    </a-form-item>
    <a-form-item label="总金额" v-if="isPurchase">
      <a-input-number id="productTotal" :precision="2" v-model="productTotal" />
      元
    </a-form-item>
    <a-form-item label="均价" v-if="isPurchase == false">
      <a-input-number id="productTotal" :precision="2" v-model="avgPrice" disabled/>
      元
    </a-form-item>
    <a-form-item label="时间">
      <a-date-picker show-time :defaultValue="moment()" @ok="onOk" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit">
        {{ isPurchase ? "入库" : "出库" }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
// @ is an alias to /src
import CascaderProduct from "@/components/CascaderProduct.vue";
import {
  insertPurchase,
  increaseInventory,
  reduceinventory,
  insertOrder,
  queryProduct,
} from "@/utils/db";
import moment from "moment";
export default {
  name: "InventoryForm",
  data() {
    return {
      moment,
      form: this.$form.createForm(this, { name: "InventoryForm" }),
      productNumber: 0,
      unit: "单位",
      productId: null,
      productTotal: 0,
      selectTime: null,
      validateStatus: "",
      checkNumberNotice: "",
      decimalAllowed: 0,
      avgPrice: 0,
    };
  },
  props: {
    isPurchase: Boolean,
  },
  mounted() {
    // console.log(this.isPurchase)
  },
  components: { CascaderProduct },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (this.selectTime == null) this.selectTime = moment().unix();
          let data = {
            productId: this.productId,
            productNumber: this.productNumber,
            cost: this.productTotal,
            time: this.selectTime,
            avgPrice: this.avgPrice,
          };
          if (this.isPurchase) {
            insertPurchase(data)
              .then(() => {
                return increaseInventory(data);
              })
              .then(() => {
                this.$message.success("入库成功!");
                console.log("add success!");
              });
          } else {
            insertOrder(data)
              .then(() => {
                return reduceinventory(data);
              })
              .then(() => {
                this.$message.success("出库成功!");
              })
              .catch((err) => {
                this.$message.error(err.message);
              });
          }
        }
      });
    },
    changeNumber(value) {
      if (this.unit == "单位") return;
      if (this.decimalAllowed == 0 && value % 1 != 0) {
        this.checkNumberNotice = this.unit + "不支持小数";
        this.validateStatus = "error";
      }
    },
    showUnit(product) {
      this.productId = product.productId;
      queryProduct(product.productId).then((product) => {
        this.avgPrice = product.total / product.inventory;
        this.avgPrice = Number(this.avgPrice).toFixed(2);
        this.unit = product.unit;
        this.decimalAllowed = product.decimalAllowed;
      });
    },
    onOk(moment) {
      this.selectTime = moment.unix();
    },
  },
};
</script>

<style>
</style>
