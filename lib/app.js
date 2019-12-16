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
      .y(d => y(d.value.playoffAvg))

const valueline2 = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.seasonAvg))

const dataset = d3.csv("../assets/mlbStats.csv");

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
  
  svg.selectAll(".dot") //Playoff HR
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", (d, i) => x(d.key))
    .attr("cy", (d, i) => y(d.value.playoffAvg))
    .attr("r", 5)
    .attr("z-index", 1)
    .style("fill", "steelblue")
    .on("click", (d) => makeBar(d.key))

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

    svg.selectAll(".dot2") //Season HR
      .data(data)
      .enter().append("circle")
      .attr("class", "playoffDot")
      .attr("cx", (d, i) => x(d.key))
      .attr("cy", (d, i) => y(d.value.seasonAvg))
      .attr("r", 5)
      .style("fill", "rgb(255, 127, 14)")
      .on("click", (d) => makeBar(d.key))

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
    .transition()
    .duration(1500)
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "translate(" + 0 + "," + 0 + ")" + "rotate(-90)")
      .style("text-anchor", "start")
      .text("Avg Home Runs per Game")
      .attr("y", -45)
      .attr("x", -285)
      
  
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
    .attr("x", 90)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
});

function makeBar(year) {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      window.location.reload(false);
    }
  }

  const margin = { top: 30, right: 50, bottom: 45, left: 80 },
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

  const svg = d3.select(".modal-body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const dataset = d3.csv("../assets/mlbStats.csv");

  dataset.then(data => {
    data = d3.nest()
    .key(d => d.year)
    .sortKeys(d3.ascending)
    .rollup(v => {
      let arr = [];
      v.forEach(series => {
        arr.push({
          series: series.series.toUpperCase(),
          t1Val: ((series.serieshrt1avg - series.seasonhrt1avg)/series.seasonhrt1avg) * 100,
          t2Val: ((series.serieshrt2avg - series.seasonhrt2avg)/series.seasonhrt2avg) * 100,
          t1Name: series.t1,
          t2Name: series.t2,
          year: series.year
        })
      })
      return arr
    })
    .entries(data)

    const parseTime = d3.timeParse("%Y");
                        data.forEach(d => {
                          d.key = parseTime(d.key)
    });

    const filtered = data.filter(seriesYear => ((Date.parse(seriesYear.key) === Date.parse(year))));
    
    const x0 = d3.scaleBand()
              .range([0, width - 10])
              .padding(.2)
              .domain(filtered[0].value.map(d => d.series))
    
    const x1 = d3.scaleBand()
                .domain(['t1Val', 't2Val'])
                .padding(.1)
                .range([0, x0.bandwidth()]);

    const y = d3.scaleLinear()
                .domain([-100, 100])
                .range([height*3/4, height/4]);

    svg.append("text")
      .attr("x", width/2)
      .text(filtered[0].key.getFullYear() + ' Playoffs');
              
    svg.append("g") // xaxis
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height/2) + ")")
      .call(d3.axisBottom(x0))

    svg.selectAll(".xaxis text")
      .attr("y", height/3)

    svg.selectAll(".xaxis line")
      .attr("y2", 0)

    svg.append("g") // yaxis
      .attr("class", "yaxis")
      .call(d3.axisLeft(y))
      svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90) translate(-285, -300)")
        .style("text-anchor", "start")
        .text('\u{0394}HRA%')
    
    d3.selectAll(".ylabel")
      .attr("y", height/2)

    const legend = svg.selectAll(".legend") // legend
      .data(['Winner', 'Loser'])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(10," + i * 20 + ")");

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => color(d))

    legend.append("text")
      .attr("x", 65)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d);

    let seriesName = svg.selectAll(".seriesName")
      .data(filtered)
      .enter().append("g")
      .attr("class", "seriesName")
    
    seriesName.selectAll(".bar.t1Val") //Team1 Bar
      .data(d => d.value)
      .enter()
      .append("rect")
      .attr("class", "bar t1Val")
      .attr("transform", d =>  "translate(" + x0(d.series) + ",0)")
    .style("fill", "steelblue")
      .attr("x", d => x1('t1Val'))
      .attr("y", d => ((height/2) - d.t1Val) > (height/2) ? height/2 : ((height/2) - d.t1Val))
      .attr("width", x1.bandwidth())
      .attr("height", d => 0)
    
    seriesName.selectAll(".bar.t2Val") //Team2Bar
      .data(d => d.value)
      .enter()
      .append("rect")
      .attr("class", "bar t2Val")
      .attr("transform", d => "translate(" + x0(d.series) + ",0)")
      .style("fill", "rgb(255, 127, 14)")
      .attr("x", d => x1('t2Val'))
      .attr("y", d => ((height/2) - d.t2Val) > (height/2) ? height/2 : ((height/2) - d.t2Val))
      .attr("width", x1.bandwidth())
      .attr("height", d =>  0)
      

    seriesName.selectAll("t1image") //Team1 Logo
      .data(d => d.value)
      .enter()
      .append("svg:image")
      .attr('xlink:href', d => `./images/${d.t1Name}.png`)
      .attr("transform", d => "translate(" + x0(d.series) + ", -10)")
      .attr("x", d => x1('t1Val'))
      .attr("y", d => ((height/2) - d.t1Val) > (height/2) ? (height/2) - 50 : ((height/2) - d.t1Val) - 50)
      .attr("opacity", 0)
      .transition()
      .duration(1500)
      .attr("opacity", 1)

    seriesName.selectAll("t2image") //Team2 Logo
      .data(d => d.value)
      .enter()
      .append("svg:image")
      .attr('xlink:href', d => `./images/${d.t2Name}.png`)
      .attr("transform", d =>  "translate(" + x0(d.series) + ", 0)")
      .attr("x", d => x1('t2Val') )
      .attr("y", d => ((height/2) - d.t2Val) > (height/2) ? ((height/2) + Math.abs(d.t2Val) + 15) : ((height/2) + 15))
      .attr("text-anchor", "start")
      .attr("opacity", 0)
      .transition()
      .duration(1500)
      .attr("opacity", 1)

       
    d3.selectAll(".t1Val")
      .transition()
      .attr("height", d => Math.abs(d.t1Val))
      .duration(2000)

    d3.selectAll(".t2Val")
      .transition()
      .attr("height", d =>  Math.abs(d.t2Val))
      .duration(2000)
  })   
}

// function makeSeries(data) {
  // d3.select("svg").remove();
  // const margin = { top: 30, right: 50, bottom: 45, left: 80 },
  //       width = 1000 - margin.left - margin.right,
  //       height = 500 - margin.top - margin.bottom;

  // const svg = d3.select("#chart").append("svg")
  //       .attr("width", width + margin.left + margin.right)
  //       .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //       .attr("transform",
  //       "translate(" + margin.left + "," + margin.top + ")")

  // const color = d3.scaleOrdinal(d3.schemeCategory10);

  // const dataset = d3.csv("../assets/test.csv");

  // dataset.then(test => {
  //   let filtered = test.filter(series => series.year === data.year && series.series === data.series.toLowerCase())
  //   filtered = d3.nest()
  //     .key(d => d.series)
      
    // const newFilter = {
    //   Hits: {
    //     't1': +filtered[0].h1,
    //     't2': +filtered[0].h2
    //   },
    //   Doubles: {
    //     't1': +filtered[0]['2b1'],
    //     't2': +filtered[0]['2b2']
    //   },
    //   Triples: {
    //     't1': +filtered[0]['3b1'],
    //     't2': +filtered[0]['3b2']
    //   },
    //   Home_Runs: {
    //     't1': +filtered[0]['3b1'],
    //     't2': +filtered[0]['3b2']
    //   },
    //   Batting_Average: {
    //     't1': +filtered[0]['3b1'],
    //     't2': +filtered[0]['3b2']
    //   }
    // }

    // const x0 = d3.scaleBand()
    //           .range([0, width - 10])
    //           .padding(.2)
    //           .domain(Object.keys(newFilter))

    // let x1 = d3.scaleBand()
    //           .domain(['t1', 't2'])
    //           .range([0, x0.bandwidth()])

    // const y = d3.scaleLinear()
    //           .domain([0,75])
    //           .range([height, height/2])


    // svg.append("g") // xaxis
    //   .attr("class", "xaxis")
    //   .attr("transform", "translate(0," + (height) + ")")
    //   .call(d3.axisBottom(x0));

    // svg.append("g") // yaxis
    //   .attr("class", "yaxis")
    //   .call(d3.axisLeft(y))

    // let stat = svg.selectAll(".stat")
    //   .data(newFilter)
    //   .enter().append("g")
    //   .attr("class", "stat")
    
    // stat.selectAll(".t1Val") //Team1 Bar
    //   .data(d => console.log(Object.values(d)))
    //   .enter()
    //   .append("rect")
    //   .attr("class", "t1Val")
    //   .attr("transform", "translate(" + x0('Hits') + ",0)")
    // .style("fill", "steelblue")
    //   .attr("x", 50 )
    //   .attr("y", 50)
    //   .attr("width", x1.bandwidth())
    //   .attr("height", 50)
  // })
// }