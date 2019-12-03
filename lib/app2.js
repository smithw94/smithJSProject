const margin = { top: 30, right: 50, bottom: 45, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


const y = d3.scaleLinear()
            .domain(-100, 100)
            .range([height, 0]);

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
  .key(d => d.series.toUpperCase())
  .rollup(v => {
    return {
      t1: v[0].t1,
      t2: v[0].t2,
      t1Val: ((v[0].serieshrt1avg - v[0].seasonhrt1avg)/v[0].seasonhrt1avg) * 100,
      t2Val: ((v[0].serieshrt2avg - v[0].seasonhrt2avg)/v[0].seasonhrt2avg) * 100
    }
  })
  .entries(data)
  
  const parseTime = d3.timeParse("%Y");
  data.forEach(d => {
    d.key = parseTime(d.key)
  });

  const xScale = d3.scaleBand()
    .range([5, width])  
    .domain(data[0].values.map(d => d.key))
    .padding(0.1);
  
  y.domain([-100, 100]);

  svg.append("g") // xaxis
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height/2) + ")")
    .call(d3.axisBottom(xScale));
    svg.append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.bottom) + ")")
      .text((data[0].key));

  svg.append("g") // yaxis
    .attr("class", "axis")
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "translate(" + -1*margin.left + "," + -1*margin.top/2 + ")")
      .style("text-anchor", "start")
      .text("Difference in HRA");

  module.selectAll()
  .data(data2 = data[0].values.forEach(d => {
      const arr = []
      // same series name 
      arr.push({
        key: d.key,
        name: d.value.t1,
        value: d.value.t1Val
      });
      arr.push({
        key: d.key,
        name: d.value.t2,
        value: d.value.t2Val
      });
      console.log(arr)
      return arr;
    }))
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.name))
    // // if the calculated y axis value is GREATER than height/2, then it needs to be set to height/2
    attr('y', d => console.log(d))
    .attr('y', (s) => (height/2) - Object.values(Object.values(s)[1])[0] > (height/2) ? (height/2) : ((height/2) - Object.values(Object.values(s)[1])[0]))
    .attr('height', (s) => Math.abs(Object.values(Object.values(s)[1])[0]))
    .attr('width', 5)

})