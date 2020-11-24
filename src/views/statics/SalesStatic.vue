<template>
  <div class="charts-container">
    <a-range-picker
      :ranges="{
        Today: [moment().startOf('day'), moment().endOf('day')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'last Month': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month'),
        ],
      }"
      @change="selectDate"
      style="margin-bottom:10px;"
    />
    <LineCharts v-if="loaded" :chartdata="chartData" :styles="myStyles" />
  </div>
</template>
<script>
import LineCharts from "@/components/Line.vue";
import { queryOrderByDay } from "@/utils/db";
import moment from "moment";
export default {
  name: "summaryCharts",
  components: { LineCharts },
  data() {
    return {
      moment,
      loaded: false,
      chartData: {
        datasets: [],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Red", "Yellow", "Blue"],
      },
      height: 650,
      startPoint: moment().startOf("month"),
      endPoint: moment().endOf("day"),
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    myStyles() {
      return {
        height: `${this.height}px`,
        width: "650px",
        position: "relative",
        margin:"auto",
      };
    },
  },
  methods: {
    selectDate(dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
      if (dates.length > 0) {
        this.startPoint = dates[0]
        this.endPoint = dates[1]
        this.getData();
      }
    },
    getData() {
      this.loaded = false;
      queryOrderByDay(this.startPoint.unix(), this.endPoint.unix())
        .then((data) => {
          // console.log(data)
          this.chartData.labels = data.days;
          this.chartData.datasets = [
            {
              label: "销量表",
              data: data.results,
              fill: false,
              backgroundcolor: "rgba(239,14,14,1)",
              borderColor: "rgba(239,14,14,1)",
            },
          ];
          this.loaded = true;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
};
</script>
<style>
.charts-container{
  text-align :center
}
</style>