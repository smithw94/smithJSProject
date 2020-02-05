const createGraph = () => {
  const dataset = d3.csv("../assets/seasonStats.csv");
  dataset.then(data => {
    data = d3.nest()
      .key(d => d.Year)
      .sortKeys(d3.ascending)
      .rollup(v => {
        return {
          hR: +v[0].hR,
          doubles: +v[0].doubles,
          triples: +v[0].triples
        }
      })
      .entries(data)
    
    const parseTime = d3.timeParse("%Y");
    
    data.forEach(d => {
      d.key = parseTime(d.key)
    });

    modAxis(data); // axis has to be created after time is parsed but before lines are appended
    
    const path = svg.append("path") //Home Runs
                    .data([data])
                    .attr("class", "line")
                    .attr("id", "HR")
                    .attr("d", homeRun) 

    const path3 = svg.append("path") // Doubles
                    .data([data])
                    .attr("class", "line")
                    .attr("d", doubles) 
                    .style("stroke", "red")

    const path4 = svg.append("path") //Triples
                    .data([data])
                    .attr("class", "line")
                    .attr("d", triples)
                    .style("stroke", "green")

    const pathLength = path.node().getTotalLength();
    const pathLength3 = path3.node().getTotalLength();
    const pathLength4 = path4.node().getTotalLength();

    const transitionPath = d3.transition()
                              .ease(d3.easeLinear)
                              .duration(3000);

    path
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .attr("id", "hR")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    path3
      .attr("stroke-dashoffset", pathLength3)
      .attr("stroke-dasharray", pathLength3)
      .attr("id", "doubles")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);

    path4
      .attr("stroke-dashoffset", pathLength4)
      .attr("stroke-dasharray", pathLength4)
      .attr("id", "triples")
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);
    
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
        .on("click", (d) => toggleLine(d))
    
      legend.append("text")
        .attr("x", 45)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d)
        .on("click", (d) => toggleLine(d))
  })
}


  
