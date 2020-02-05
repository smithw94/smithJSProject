const toggleLine = hitType => {
  let line = d3.selectAll('#' + hitType)
  if (line._groups[0].length > 0) {
    return line.remove();
  } else {
    return addLine(hitType);
  }
}

const addLine = hitType => {
  const linePlot = d3.line()
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
    
    const line = svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", linePlot)
                    .attr("id", hitType)
                    
    if (hitType === 'triples') {
      line.style("stroke", "green")
    } else if (hitType === 'doubles') {
      line.style("stroke", "red")
    }
  })
}