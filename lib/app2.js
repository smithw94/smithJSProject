const doFunction = () => {
  const margin = { top: 30, right: 50, bottom: 45, left: 80 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const x = d3.scaleTime().range([10, width - 10]);
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
      .y(d => y(d.value.HR))

  const valueline2 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.value.H))

  const valueline3 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.value.BB))

  const valueline4 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.value.BBB))
      
  const dataset = d3.csv("../assets/seasonStats.csv");

  dataset.then(data => {
    data = d3.nest()
      .key(d => d.Year)
      .sortKeys(d3.ascending)
      .rollup(v => {
        return {
          HR: +v[0].HR,
          H: +v[0].H,
          BB: +v[0].BB,
          BBB: +v[0].BBB
        }
      })
      .entries(data)

    const parseTime = d3.timeParse("%Y");
    
    data.forEach(d => {
      d.key = parseTime(d.key)
    });
  
    x.domain(d3.extent(data, d => d.key));
    y.domain([0, d3.max(data, d => d.value.BB)]);
    
    const path = svg.append("path") //Home Runs
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline) 

    const path2 = svg.append("path") //Hits
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline3)
                    .style("stroke", "rgb(255, 127, 14)")

    const path3 = svg.append("path") // Doubles
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline) 
                    .style("stroke", "rgb(255, 127, 140)")

    const path4 = svg.append("path") //Triples
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline4)
                    .style("stroke", "rgb(255, 127, 40)")

  const pathLength = path.node().getTotalLength();
  const pathLength2 = path2.node().getTotalLength();

  const transitionPath = d3
      .transition()
      .ease(d3.easeLinear)
      .duration(3000);
  
  const transitionPath2 = d3
      .transition()
      .ease(d3.easeLinear)
      .duration(3000);

  path
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);

  path2
    .attr("stroke-dashoffset", pathLength2)
    .attr("stroke-dasharray", pathLength2)
    .transition(transitionPath2)
    .attr("stroke-dashoffset", 0);

    svg.selectAll(".dot") //Homeruns
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => x(d.key))
        .attr("cy", (d, i) => y(d.value.HR))
        .attr("r", 2)
        .attr("z-index", 1)
        .style("fill", "steelblue")

    svg.selectAll(".dot2") //Hits
      .data(data)
      .enter().append("circle")
      .attr("class", "playoffDot")
      .attr("cx", (d, i) => x(d.key))
      .attr("cy", (d, i) => y(d.value.H))
      .attr("r", 5)
      .style("fill", "rgb(255, 127, 14)")


  


  svg.append("g") // xaxis
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      svg.append("text")
        .attr("transform", "translate(" + width/2 + "," + (height + margin.bottom) + ")")
        .text("Year");
  
  svg.append("g") // yaxis
    .attr("class", "axis")
    .transition()
    .duration(1500)
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "translate(" + 0 + "," + 0 + ")" + "rotate(-90)")
      .style("text-anchor", "start")
      .text("Home Run Avg per Game")
      .attr("y", -45)
      .attr("x", -285)
  })
}

  
