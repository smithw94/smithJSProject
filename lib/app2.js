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

  const valueline3 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.value.Doubles))

  const valueline4 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.value.Triples))

  const dataset = d3.csv("../assets/seasonStats.csv");

  dataset.then(data => {
    data = d3.nest()
      .key(d => d.Year)
      .sortKeys(d3.ascending)
      .rollup(v => {
        return {
          HR: +v[0].HR,
          Singles: +v[0].H,
          Doubles: +v[0].BB,
          Triples: +v[0].BBB
        }
      })
      .entries(data)

    const parseTime = d3.timeParse("%Y");
    
    data.forEach(d => {
      d.key = parseTime(d.key)
    });
  
    x.domain(d3.extent(data, d => d.key));
    y.domain([0, d3.max(data, d => d.value.Doubles)]);
    
    const path = svg.append("path") //Home Runs
                    .data([data])
                    .attr("class", "line")
                    .attr("id", "HR")
                    .attr("d", valueline) 

    const path3 = svg.append("path") // Doubles
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline3) 
                    .style("stroke", "red")

    const path4 = svg.append("path") //Triples
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline4)
                    .style("stroke", "green")

    const pathLength = path.node().getTotalLength();
    const pathLength3 = path3.node().getTotalLength();
    const pathLength4 = path4.node().getTotalLength();

    const transitionPath = d3
        .transition()
        .ease(d3.easeLinear)
        .duration(3000);

    path
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .attr("id", "HR")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    path3
      .attr("stroke-dashoffset", pathLength3)
      .attr("stroke-dasharray", pathLength3)
      .attr("id", "Doubles")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    path4
      .attr("stroke-dashoffset", pathLength4)
      .attr("stroke-dasharray", pathLength4)
      .attr("id", "Triples")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    svg.selectAll(".dot") //Homeruns
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => x(d.key))
        .attr("cy", (d, i) => y(d.value.HR))
        .attr("r", 2)
        .attr("z-index", 1)
        .style("fill", "grey")

    svg.selectAll(".dot3") //Doubles
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => x(d.key))
        .attr("cy", (d, i) => y(d.value.Doubles))
        .attr("r", 2)
        .attr("z-index", 1)
        .style("fill", "grey")

    svg.selectAll(".dot4") //Triples
      .data(data)
      .enter().append("circle")
      .attr("class", "playoffDot")
      .attr("cx", (d, i) => x(d.key))
      .attr("cy", (d, i) => y(d.value.Triples))
      .attr("r", 2)
      .attr("id", "Triples")
      .style("fill", "grey")

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
        .text("Hit Types per Game")
        .attr("y", -45)
        .attr("x", -285)


      const legend = svg.selectAll(".legend") // legend
        .data(Object.keys(data[0].value))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(10," + i * 20 + ")");
    
      legend.append("rect")
        .attr("x", 50)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d))
        .on("click", (d) => doFunction2(d))
    
      legend.append("text")
        .attr("x", 45)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d)
        .on("click", (d) => doFunction2(d))
  })
}

const doFunction2 = test => {
  d3.selectAll("#Triples").style("fill", "red")
}

  
