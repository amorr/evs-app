<template>
  <div class="home">
    <div class="card-box">
      <a-card title="采购单" :bordered="true">
        <InventoryForm :isPurchase=true />
      </a-card>
    </div>
    <div class="card-box">
      <a-card title="出库单" :bordered="true">
        <InventoryForm :isPurchase=false />
      </a-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import InventoryForm from '@/components/InventoryForm.vue'
export default {
  name: "Home",
  data(){
    return {
      
    }
  },
  components: {InventoryForm},
  methods:{
  }
};
</script>

<style>
.home{
  display: flex;
  justify-content: space-around;
}
.card-box {
  width: 48%;
  max-width: 800px;
  margin-bottom: 3rem;
}
</style>
