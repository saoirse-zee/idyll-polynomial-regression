const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class CustomD3Component extends D3Component {

  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');

    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.append('circle')
      .attr('r', 10)
      .attr('cx', Math.random() * size)
      .attr('cy', Math.random() * size);
  }

  update({ x }) {
    this.svg.selectAll('circle')
      .transition()
      .duration(1250)
      .attr('cx', x)
      .attr('cy', size / 2);
  }
}

module.exports = CustomD3Component;
