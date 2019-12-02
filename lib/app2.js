const margin = { top: 30, right: 50, bottom: 45, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")

const color = d3.scaleOrdinal(d3.schemeCategory10);

const dataset = d3.csv("../assets/mlbStats.csv");

dataset.then(data => {
  data = d3.nest()
  .key(d => d.year )
  .sortKeys(d3.ascending)
  .key(d => d.series)
  .rollup(v => {
    return {
      [v[0].t1]: ((v[0].serieshrt1avg - v[0].seasonhrt1avg)/v[0].seasonhrt1avg) * 100,
      [v[0].t2]: ((v[0].serieshrt2avg - v[0].seasonhrt2avg)/v[0].seasonhrt2avg) * 100
    }
  })
  .entries(data)
  

  const parseTime = d3.timeParse("%Y");
  data.forEach(d => {
    d.key = parseTime(d.key)
  });

  
})