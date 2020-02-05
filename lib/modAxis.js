const modAxis = (data) => {
  x.domain(d3.extent(data, d => d.key));
  y.domain([0, d3.max(data, d => d.value.doubles)]);

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
}