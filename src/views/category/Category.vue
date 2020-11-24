<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      title="编辑分类"
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
        <a-button type="primary" html-type="submit"> 更新 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { updateCategory, getCategory } from "@/utils/db";
export default {
  name: "UpdateCategory",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "updateCategory" }),
      category:{}
    };
  },
  mounted() {
    let categoryId = this.$route.params.id
    if(categoryId){
      getCategory(categoryId).then((data)=>{
        this.category = data
        this.form.setFieldsValue({
          categoryname:data.categoryName
        })
      })
    }else{
      this.$message.error('错误，没有找到商品')
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          updateCategory(values.categoryname, this.category.id).then(() => {
            this.$message.success("更新成功!");
          }).catch((err)=>{
            this.$message.error(err.message)
          });
        }
      });
    },
  },
};
</script>

