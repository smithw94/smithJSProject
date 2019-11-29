
// TO DISPLAY ANY OF THE DATA FIRST INITIATE A LOCAL PYTHON SERVER BY RUNNING 
// python3 -m http.server
// IN THE TERMINAL
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%Y");

// set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// define the 1st line
const valueline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.sHR); })
    .curve(d3.curveMonotoneX)

// define the 2nd line
const valueline2 = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.pHR); })
    .curve(d3.curveMonotoneX);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/hrCompare.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Year = parseTime(d.Year);
    d.sHR = +d.sHR;
    d.pHR = +d.pHR;
  });

  x.domain(d3.extent(data, function(d){ return d.Year; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.sHR, d.pHR); })]);

  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
})