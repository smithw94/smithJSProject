function makeBar(series, year) {
  console.log(series, year)
  d3.select("svg").remove();
  const margin = { top: 30, right: 50, bottom: 45, left: 80 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
        .on("click", () => window.location.reload(false))

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const dataset = d3.csv("../assets/test.csv");

  dataset.then(data => {
    // data = d3.nest()
    // .key(d => d.year)
    // .sortKeys(d3.ascending)
    // .rollup(v => {
    //   let arr = [];
    //   v.forEach(series => {
    //     arr.push({
    //       series: series.series.toUpperCase(),
    //       t1Val: ((series.serieshrt1avg - series.seasonhrt1avg)/series.seasonhrt1avg) * 100,
    //       t2Val: ((series.serieshrt2avg - series.seasonhrt2avg)/series.seasonhrt2avg) * 100,
    //       t1Name: series.t1,
    //       t2Name: series.t2
    //     })
    //   })
    //   return arr
    // })
    // .entries(data)
    // const parseTime = d3.timeParse("%Y");
    // data.forEach(d => {
    //   d.key = parseTime(d.key)
    // });
    
    console.log(data)
  })
}