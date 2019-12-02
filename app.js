const margin = { top: 30, right: 50, bottom: 45, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width - 10]);
const y = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")

const color = d3.scaleOrdinal(d3.schemeCategory10);

const valueline = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.playoffAvg))

const valueline2 = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.seasonAvg))

const dataset = d3.csv("./data/mlbStats.csv");

dataset.then(data => {
  data = d3.nest()
    .key(d => d.year )
    .sortKeys(d3.ascending)
    .rollup(v => {  
      return {
        playoffAvg: ((d3.sum(v, d => d.serieshr2count) + d3.sum(v, d => d.serieshr1count)) / (d3.sum(v, d => d.gamesInSeries) * 2)),
        seasonAvg: (d3.mean(v, d => d.seasonhr2count) + d3.mean(v, d => d.seasonhr1count))/(162*2)
      } 
    })
    .entries(data)
  
  const parseTime = d3.timeParse("%Y");
  data.forEach(d => {
    d.key = parseTime(d.key)
    d.value.playoffAvg = +d.value.playoffAvg
  });

  x.domain(d3.extent(data, d => d.key));
  y.domain([0, d3.max(data, d => d.value.seasonAvg)]);

  const path = svg.append("path") //playoffAvgLine
    .data([data])
      .attr("class", "line")
      .attr("d", valueline)  

  const pathLength = path.node().getTotalLength();

  const transitionPath = d3
    .transition()
    .ease(d3.easeLinear)
    .duration(3000);
  
  path
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);

  const path2 = svg.append("path") //seasonAvgLine
    .data([data])
      .attr("class", "line")
      .attr("d", valueline2)
      .style("stroke", "rgb(255, 127, 14)")

  const pathLength2 = path2.node().getTotalLength();

  const transitionPath2 = d3
    .transition()
    .ease(d3.easeLinear)
    .duration(3000);
  
  path2
    .attr("stroke-dashoffset", pathLength2)
    .attr("stroke-dasharray", pathLength2)
    .transition(transitionPath2)
    .attr("stroke-dashoffset", 0);

  svg.append("g") // xaxis
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    svg.append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.bottom) + ")")
      .text("Year");
  
  svg.append("g") // yaxis
    .attr("class", "axis")
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "translate(" + -1*margin.left + "," + -1*margin.top/2 + ")")
      .style("text-anchor", "start")
      .text("Home Runs per Game");
  
  const legend = svg.selectAll(".legend") // legend
    .data(Object.keys(data[0].value))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(10," + i * 20 + ")");

  legend.append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => color(d))

  legend.append("text")
    .attr("x", 70)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
  
  // black line
  const mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  const lines = document.getElementsByClassName('line');
  
  const mousePerLine = mouseG.selectAll(".mouse-per-line")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

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
      let mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          let d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        
        let xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.key; }).right;
            idx = bisect(d.value, xDate);

        if (i < 2) {
          let beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;
            
          while (true) {
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
        }
      });
  });
});




