const toggleLine = hitType => {
  let line = d3.selectAll('#' + hitType)
  if (line._groups[0].length > 0) {
    return line.remove();
  } else {
    return addLine(hitType);
  }
}

const addLine = hitType => {
  const line = d3.line()
    .x(d => x(d.key))
    .y(d => y(d.value[hitType]))

  const dataset = d3.csv("../assets/seasonStats.csv");
  dataset.then(data => {
    data = d3.nest()
      .key(d => d.Year)
      .sortKeys(d3.ascending)
      .rollup(v => ({ [hitType]: +v[0][hitType] }))
      .entries(data)

    const parseTime = d3.timeParse("%Y");
      
    data.forEach(d => {
      d.key = parseTime(d.key)
    });
    
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "green")
        .attr("id", hitType)
  })
}