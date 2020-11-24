<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      title="添加新分类"
      sub-title=""
      @back="() => $router.go(-1)"
    ></a-page-header>
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      @submit="handleSubmit"
    >
      <a-form-item label="分类名称">
        <a-input
          v-decorator="[
            'categoryname',
            { rules: [{ required: true, message: '必须填写分类名称' }] },
          ]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { insertCategory } from "@/utils/db";
export default {
  name: "AddNewCategory",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "addNewCategory" }),
    };
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          insertCategory(values.categoryname).then(() => {
            this.$message.success("新分类添加成功!");
          }).catch((err)=>{
            this.$message.error(err.message)
          });
        }
      });
    },
  },
};
</script>

