const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;

const svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

const year = d3.timeParse("%Y");
const dataset = d3.csv("./data/mlbStats.csv");
dataset.then(data => {
  allData = data;
  data = d3.nest()
    .key(d => d.year )
    .rollup(v => {
      
      return {
        avg: ((d3.sum(v, d => d.serieshr2count) + d3.sum(v, d => d.serieshr1count)) / (d3.sum(v, d => d.gamesInSeries) * 2))
      }
    })
    .entries(data)
  console.log(data)
})



