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

// starting values for lines
const homeRun = d3.line()
  .x(d => x(d.key))
  .y(d => y(d.value.hR))

const doubles = d3.line()
    .x(d => x(d.key))
    .y(d => y(d.value.doubles))

const triples = d3.line()
    .x(d => x(d.key))
    .y(d => y(d.value.triples))