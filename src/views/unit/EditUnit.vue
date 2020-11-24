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
      <a-form-item label="单位名称">
        <a-input
          v-decorator="[
            'unitname',
            { rules: [{ required: true, message: '必须填写单位名称' }] },
          ]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-checkbox :checked="checkAllowDecimal" @change="handleChange">
          是否允许小数值
        </a-checkbox>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getUnit, updateUnit } from "@/utils/db";
export default {
  name: "AddNewUnit",
  data() {
    return {
      checkAllowDecimal: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "addNewUnit" }),
      headerTitle: "编辑分类",
      unit: {},
    };
  },
  mounted() {
    if (this.$route.params.id) {
      getUnit(this.$route.params.id).then((data) => {
        if (data) {
          this.unit = data;
          this.headerTitle = "编辑分类" + data.unitName;
          this.form.setFieldsValue({
            unitname: data.unitName,
          });
          this.checkAllowDecimal = data.decimalAllowed?true:false;
        } else {
          console.log(data);
        }
      });
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          updateUnit(this.unit.id, values.unitname, this.checkAllowDecimal)
            .then(() => {
              // console.log("inset a unit success!");
              this.$message.success(this.unit.unitName + "修改成功!");
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    handleChange(e) {
      this.checkAllowDecimal = e.target.checked;
    },
  },
};
</script>

