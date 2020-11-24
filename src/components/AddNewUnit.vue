<template>
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
</template>

<script>
import { insertUnit } from "@/utils/db";
export default {
  name: "AddNewUnit",
  data() {
    return {
        checkAllowDecimal: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "addNewUnit" }),
    };
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          insertUnit(values.unitname,this.checkAllowDecimal).then(() => {
            // console.log("inset a unit success!");
            this.$emit('update-unit');
            this.openNotification("添加成功", "新单位添加成功!");
          });
        }
      });
    },
    handleChange(e){
        this.checkAllowDecimal = e.target.checked;
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

