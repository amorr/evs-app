<template>
  <div>
    <a-cascader
      :options="products"
      :display-render="displayRender"
      :show-search="{ filter }"
      expand-trigger="hover"
      placeholder="Please select"
      @change="onChange"
    />
  </div>
</template>
<script>
import { queryAllCategoryWithProduct } from "@/utils/db.js";
export default {
  data() {
    return {
      products: [],
    };
  },
  props: {
  },
  mounted() {
    this.getAllCategoryWithProduct();
  },
  methods: {
    onChange(value) {
      // console.log(value);
      // let categoryId = value[0]
      let productId =value[1]
      this.$emit('select-product',{productId:productId})
    },
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },
    getAllCategoryWithProduct() {
      this.products = [];
      queryAllCategoryWithProduct().then((data) => {
        // console.log(data);
        let categoryId = 0;
        let category = null;
        for (let index = 0; index < data.length; index++) {
          let element = data[index];
          if (element.categoryId != categoryId) {
            if (category != null) {
              this.products.push(category);
            }
            category = {
              label: element.categoryName,
              value: element.categoryId,
              children: [],
            };
          }
          let product = {
            value: element.productId,
            label: element.productName,
            unit: element.unitName,
            decimalAllowed: element.decimalAllowed
          };
          category.children.push(product);
          categoryId = element.categoryId;

          if (index == data.length - 1) {
            this.products.push(category);
          }
        }
      });
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },
  },
};
</script>
