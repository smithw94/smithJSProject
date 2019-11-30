
// TO DISPLAY ANY OF THE DATA FIRST INITIATE A LOCAL PYTHON SERVER BY RUNNING 
// python3 -m http.server
// IN THE TERMINAL
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth - margin.left - margin.right
  , height = window.innerHeight - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%Y");

// set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// define the 1st line
const valueline = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.sHR))
  .curve(d3.curveMonotoneX)

// define the 2nd line

const valueline2 = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.pHR))

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/hrCompare.csv")
  .then((data, error) => {
  
  data.forEach(d => {
    d.Year = parseTime(d.Year);
    d.sHR = +d.sHR;
    d.pHR = +d.pHR;
  });

  x.domain(d3.extent(data, d => 
    d.Year));

  y.domain([0, d3.max(data, d => 
    Math.max(d.sHR, d.pHR) 
  )]);

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

  console.log(data)
  })

// create g for mouse-over effects

var mouseG = svg.append("g")
.attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
.attr("class", "mouse-line")
.style("stroke", "black")
.style("stroke-width", "1px")
.style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
// .data(data needs to go here!)
.enter()
.append("g")
.attr("class", "mouse-per-line");

mousePerLine.append("circle")
.attr("r", 7)
.style("stroke", function(d) {
  return color(d.name);
})
.style("fill", "none")
.style("stroke-width", "1px")
.style("opacity", "0");

mousePerLine.append("text")
.attr("transform", "translate(10,3)");

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
.attr('width', width) // can't catch mouse events on a g element
.attr('height', height)
.attr('fill', 'none')
.attr('pointer-events', 'all')
.on('mouseout', function() { // on mouse out hide line, circles and text
  d3.select(".mouse-line")
    .style("opacity", "0");
  d3.selectAll(".mouse-per-line circle")
    .style("opacity", "0");
  d3.selectAll(".mouse-per-line text")
    .style("opacity", "0");
})
.on('mouseover', function() { // on mouse in show line, circles and text
  d3.select(".mouse-line")
    .style("opacity", "1");
  d3.selectAll(".mouse-per-line circle")
    .style("opacity", "1");
  d3.selectAll(".mouse-per-line text")
    .style("opacity", "1");
})
.on('mousemove', function() { // mouse moving over canvas
  var mouse = d3.mouse(this);
  d3.select(".mouse-line")
    .attr("d", function() {
      var d = "M" + mouse[0] + "," + height;
      d += " " + mouse[0] + "," + 0;
      return d;
    });

  d3.selectAll(".mouse-per-line")
    .attr("transform", function(d, i) {
      console.log(width/mouse[0])
      var xDate = x.invert(mouse[0]),
          bisect = d3.bisector(function(d) { return d.date; }).right;
          idx = bisect(d.values, xDate);
      
      var beginning = 0,
          end = lines[i].getTotalLength(),
          target = null;

      while (true){
        target = Math.floor((beginning + end) / 2);
        pos = lines[i].getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
            break;
        }
        if (pos.x > mouse[0])      end = target;
        else if (pos.x < mouse[0]) beginning = target;
        else break; //position found
      }
      
      d3.select(this).select('text')
        .text(y.invert(pos.y).toFixed(2));
        
      return "translate(" + mouse[0] + "," + pos.y +")";
    });
});