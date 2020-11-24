<template>
  <a-form
    :form="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 12 }"
    @submit="handleSubmit"
  >
    <a-form-item label="产品名称">
      <a-input
        v-decorator="[
          'productname',
          { rules: [{ required: true, message: '必须填写产品名称' }] },
        ]"
      />
    </a-form-item>
    <a-form-item label="单位">
      <a-select
        v-decorator="[
          'unit',
          { rules: [{ required: true, message: '必须选择单位' }] },
        ]"
        @change="handleSelectChange"
      >
        // eslint-disable-next-line vue/valid-v-for
        <a-select-option v-for="item in units" :key="item.id">
          {{ item.unitName }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="分类">
      <a-select
        v-decorator="[
          'category',
          {
            rules: [
              {
                required: true,
                message: '请选择分类',
                type: 'array',
              },
            ],
          },
        ]"
        mode="multiple"
      >
        <a-select-option v-for="item in categories" :key="item.id">
          {{ item.categoryName }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="产品数量">
      <a-input v-decorator="['productNumber', { initialValue: 0 }]" />
    </a-form-item>
    <a-form-item label="产品总价值">
      <a-input v-decorator="['productValue', { initialValue: 0 }]" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit"> Submit </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { queryAllUnit, queryAllCategory, insertNewProduct } from "@/utils/db";
export default {
  name: "AddNewProduct",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "addNewProduct" }),
      units: [],
      categories: [],
    };
  },
  mounted() {
    this.getUnit();
    this.getcategories();
  },
  methods: {
    getUnit() {
      queryAllUnit().then((data) => {
        this.units = data;
      });
    },
    getcategories() {
      queryAllCategory().then((data) => {
        this.categories = data;
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          insertNewProduct(values).then(() => {
            // console.log("inset a new product success!");
            this.openNotification("添加成功", "新产品添加成功!");
          });
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      // });
    },
    openNotification(notificationTitle, description) {
      this.$notification.open({
        message: notificationTitle,
        description: description,
        duration: 2,
        onClick: () => {
          // console.log('Notification Clicked!');
        },
      });
    },
  },
};
</script>

