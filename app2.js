const margin = { top: 30, right: 20, bottom: 45, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")

const valueline = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.playoffAvg))

const valueline2 = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.seasonAvg))

const dataset = d3.csv("./data/mlbStats.csv");

dataset.then(data => {
  allData = data;
  data = d3.nest()
    .key(d => d.year )
    .sortKeys(d3.ascending)
    .rollup(v => {  
      return {
        playoffAvg: ((d3.sum(v, d => d.serieshr2count) + d3.sum(v, d => d.serieshr1count)) / (d3.sum(v, d => d.gamesInSeries) * 2)),
        seasonAvg: ((d3.mean(v, d => d.seasonhr2count)/162) + (d3.mean(v, d => d.seasonhr1count)/162))/2
      } 
    })
    .entries(data)
  
  const parseTime = d3.timeParse("%Y");
  data.forEach(d => {
    d.key = parseTime(d.key);
    d.value.playoffAvg = +d.value.playoffAvg
  });
  
  x.domain(d3.extent(data, d => d.key));
  y.domain([0, d3.max(data, d => d.value.seasonAvg)]);

  svg.append("path")
    .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  svg.append("path")
    .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg.append("text")
        .attr("transform", "translate(" + width/2 + "," + (height + margin.bottom-5) + ")")
        .text("Year");

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
    svg.append("text")
        .attr("transform", "translate(" + -1*margin.left + "," + -1*margin.top/2 + ")")
        .style("text-anchor", "start")
        .text("Home Runs per Game");
});



