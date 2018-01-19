const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const regression = require('regression')

const size = 600;

const historyData = [
  { x: 0.5, y: 1, },
  { x: 2, y: 3, },
  { x: 3, y: 2, },
  { x: 4, y: 2, },
  { x: 4.5, y: 5, },
]

// Calculate the model using a polynomial regression
const result = regression.polynomial(historyData.map(i => [i.x, i.y]), { order: 3, precision: 2 })

const { equation } = result

const y = x => (
  equation[0] * x ** 3 +
  equation[1] * x ** 2 +
  equation[2] * x +
  equation[3]
)

const modelPoints =
  historyData.map(i => ({
    x: i.x,
    y: y(i.x),
  }))

const xScale = d3.scaleLinear()
  .domain([0, 5])
  .range([10, 550])

const yScale = d3.scaleLinear()
  .domain([0, 5])
  .range([550, 10])

const xAxis = d3.axisBottom(xScale)

const yAxis = d3.axisLeft(yScale)

const historyLine =
  d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))

const projectionLine =
  d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveCatmullRom.alpha(0.5))

class Line extends D3Component {

  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');

    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto')

    svg.append("g")
      .attr('class', 'axis')
      .attr('transform', 'translate(0, 580)')
      .call(xAxis)

    svg.append("g")
      .attr('class', 'axis')
      .attr('transform', 'translate(25, 0)')
      .call(yAxis)

    svg.append("path")
      .attr("d", historyLine(historyData))
      .attr("fill", "none")
      .attr("stroke", "tomato")
      .attr("stroke-width", "3px")

    svg.append("path")
      .attr("d", projectionLine(modelPoints))
      .attr("fill", "none")
      .attr("stroke", "#f44ebb")
      .attr("stroke-width", "3px")

    // "Backlog", or whatever
    svg.append('rect')
      .attr('width', 500)
      .attr('height', 10)
      .attr('x', 35)
      .attr('y', yScale(2.5) - 5) // Start near the middle
      .attr('fill', 'aqua')
      .attr('opacity', '0.3')
  }

  update({ y }) {
    this.svg.selectAll("rect")
      .attr('y', yScale(y) - 5) // Subtract half of height to vertically center it
  }
}

module.exports = Line;
