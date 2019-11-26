let parseDate = d3.timeParse("%Y");

const margin = {left: 10, right: 20, top: 20, bottom: 50 };

const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


let max = 0;

const xNudge = 50;
const yNudge = 20;

let minDate = new Date();
let maxDate = new Date();


d3.csv("./data/seasonAvgs.csv")
  .row(function(d) { return { Year: parseDate(d.Year), HR: Number(d.HR)}; })
  .get(function(error, rows) {
    max = d3.max(rows, function(d) { return d.HR; });
    minDate = d3.min(rows, function(d) {return d.Year; });
    maxDate = d3.max(rows, function(d) { return d.Year; });

  const y = d3.scaleLinear()
    .domain([0,max])
    .range([height,0]);

  const x = d3.scaleTime()
      .domain([minDate,maxDate])
      .range([0,width]);

  const yAxis = d3.axisLeft(y);

  const xAxis = d3.axisBottom(x);

  const line = d3.line()
    .x(function(d){ return x(d.Year); })
    .y(function(d){ return y(d.HR); })
    .curve(d3.curveCardinal);

  const svg = d3.select("body").append("svg").attr("id","svg").attr("height","100%").attr("width","100%");
  const chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

		chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(rows); })


		chartGroup.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis);
})