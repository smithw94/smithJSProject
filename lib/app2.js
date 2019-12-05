const margin = { top: 30, right: 50, bottom: 45, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")

const color = d3.scaleOrdinal(d3.schemeCategory10);

const dataset = d3.csv("../assets/mlbStats2.csv");

dataset.then(data => {
  data = d3.nest()
  .key(d => d.year)
  .sortKeys(d3.ascending)
  .rollup(v => {
    let arr = [];
    v.forEach(series => {
      arr.push({
        series: series.series,
        t1Val: ((series.serieshrt1avg - series.seasonhrt1avg)/series.seasonhrt1avg) * 100,
        t2Val: ((series.serieshrt2avg - series.seasonhrt2avg)/series.seasonhrt2avg) * 100
      })
    })
    return arr
  })
  .entries(data)
  const parseTime = d3.timeParse("%Y");
  data.forEach(d => {
    d.key = parseTime(d.key)
  });




  let x0 = d3.scaleBand()
            .range([0, width - margin.left - margin.right])
            .padding(.2)
  
  x0.domain(data[0].value.map(d => d.series))
  
  let x1 = d3.scaleBand()
    
  x1.domain(['t1Val', 't2Val']).range([0, x0.bandwidth()])

  const y = d3.scaleLinear()
              .domain([-100, 100])
              .range([height, 0]);
            
  
  // y.domain([-100, 100]);

  svg.append("g") // xaxis
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height/2) + ")")
    .call(d3.axisBottom(x0));

  svg.append("g") // yaxis
    .attr("class", "axis")
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "translate(" + -1*margin.left + "," + -1*margin.top/2 + ")")
      .style("text-anchor", "start")
      .text("Difference in HRA");

  let seriesName = svg.selectAll(".seriesName")
    .data(data)
    .enter().append("g")
    .attr("class", "seriesName")
  
  seriesName.selectAll(".bar.t1Val")
    .data(d => d.value)
    .enter()
    .append("rect")
    .attr("class", "bar t1Val")
    .attr("transform", function(d) { return "translate(" + x0(d.series) + ",0)"; })
  .style("fill", "blue")
    .attr("x", d => x1('t1Val'))
    .attr("y", d => y(d.t1Val))
    .attr("width", x1.bandwidth())
    .attr("height", d => Math.abs(y(d.t1Val)));

  seriesName.selectAll(".bar.t2Val")
    .data(d => d.value)
    .enter()
    .append("rect")
    .attr("class", "bar t2Val")
    .attr("transform", function(d) { return "translate(" + x0(d.series) + ",0)"; })
  .style("fill","red")
    .attr("x", d => x1('t2Val'))
    .attr("y", d => y(d.t2Val))
    .attr("width", x1.bandwidth())
    .attr("height", d => Math.abs(d.t2Val));

})