<template>
  <div class="charts-container" style="text-align:center">
    <Doughnut v-if="loaded" :chartdata="chartData" :styles="myStyles" />
  </div>
</template>
<script>
import Doughnut from "@/components/Doughnut.vue";
import { getTotalByCategory } from "@/utils/db";
export default {
  name: "summaryCharts",
  components: { Doughnut },
  data() {
    return {
      loaded: false,
      chartData: {
        datasets: [],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Red", "Yellow", "Blue"],
      },
      height: 600,
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    myStyles() {
      return {
        height: `${this.height}px`,
        width: "600px",
        position: "relative",
        margin:"auto",
        marginTop:"10px",
      };
    },
  },
  methods: {
    getData() {
        this.loaded = false
      getTotalByCategory().then((categories) => {
        let data = categories.map((c) => {
          return c.total;
        });
        let labels = categories.map((c) => {
          return c.categoryName;
        });
        let backgroundcolors = categories.map(() => {
          return this.random_bg_color();
        });
        this.chartData.datasets[0]= {
            data:data,
            backgroundColor : backgroundcolors   
        }
        this.chartData.labels = labels;
        this.loaded = true
      });
    },
    random_bg_color() {
      var x = Math.floor(Math.random() * 256);
      var y = Math.floor(Math.random() * 256);
      var z = Math.floor(Math.random() * 256);
      return "rgb(" + x + "," + y + "," + z + ")";
    },
  },
};
</script>