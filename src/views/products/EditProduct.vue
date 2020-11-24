<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      :title="headerTitle"
      sub-title=""
      @back="() => $router.go(-1)"
    ></a-page-header>
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
  </div>
</template>

<script>
import {
  queryAllUnit,
  queryAllCategory,
  queryProduct,
  updateProduct,
  queryRelatedCategoryByProductId,
  deleteProductCategoryByProductId,
  addProductToManyCategory,
} from "@/utils/db";
export default {
  name: "EditProduct",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "addNewProduct" }),
      units: [],
      categories: [],
      headerTitle: "",
      product: {},
    };
  },
  mounted() {
    this.getUnit();
    this.getcategories();
    if (this.$route.params.id) {
      queryProduct(this.$route.params.id)
        .then((data) => {
          if (data) {
            this.product = data;
            this.headerTitle = "编辑产品" + data.productName;
            this.form.setFieldsValue({
              productname: data.productName,
              productValue: data.total,
              productNumber: data.inventory,
              unit: data.unitId,
            });
          } else {
            console.log(data);
            throw data;
          }
        })
        .then(() => {
          queryRelatedCategoryByProductId(this.product.id).then((data) => {
            if (data) {
              data = data.map((d) => d.id);
              this.form.setFieldsValue({
                category: data,
              });
            }
          });
        })
        .catch((err) => this.$message.error(err.message));
    }
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
          updateProduct(values,this.product.id)
            .then(()=>{
                return deleteProductCategoryByProductId([this.product.id])
            })
            .then(()=>{
                return addProductToManyCategory(this.product.id,values.category)
            })
            .then(() => {
              // console.log("inset a new product success!");
              this.$message.success(this.product.productName + "更新成功!");
            })
            .catch((err) => {
              this.$message.error(err.message);
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
  },
};
</script>

