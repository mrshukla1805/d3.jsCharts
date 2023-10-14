
const stocks = [
    { date: '24-Apr-07', close: 60.241222 },
    { date: '25-Apr-07', close: 75.35231313 },
    { date: '26-Apr-07', close: 98.83134 },
    { date: '27-Apr-07', close: 99.9335352 },
    { date: '30-Apr-07', close: 85.8353530 },
    { date: '1-May-07', close: 99.452357 },
    { date: '2-May-07', close: 110.4352357 },
    { date: '3-May-07', close: 80.47253 },
    { date: '4-May-07', close: 99.4523537 },
    { date: '5-May-07', close: 66.42357 },
    { date: '6-May-07', close: 75.425327 },
    { date: '7-May-07', close: 75.425327 },
    { date: '8-May-07', close: 72.425327 },
    { date: '9-May-07', close: 70.425327 },
    { date: '10-May-07', close: 65.425327 },
    { date: '11-May-07', close: 77.425327 },
    { date: '14-May-07', close: 75.425327 },
    { date: '15-May-07', close: 80.425327 },
    { date: '16-May-07', close: 83.425327 },
    { date: '17-May-07', close: 85.425327 },
    { date: '18-May-07', close: 90.425327 },
  ];
  
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  const parseTime = d3.timeParse('%d-%b-%y');
  const bisectDate = d3.bisector(d => parseTime(d.date)).left;
  const formatCurrency = d3.format('($.2f');
  
  const xScale = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(stocks, d => parseTime(d.date)));  // or, in alternative
    // .domain([new Date(parseTime(stocks[0].date)), new Date(parseTime(stocks[stocks.length - 1].date))]);
  
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(stocks, d => d.close)]);
  
  const line = d3.line()
    .x(d => xScale(parseTime(d.date)))
    .y(d => yScale(d.close));
  
  const xAxis = d3.axisBottom()
    .scale(xScale);
  
  const yAxis = d3.axisLeft()
    .scale(yScale);
  
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const linepath = svg.append('g');
  
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  
  const focus = svg.append('g')
    .style('display', 'none');
  
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);
  
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price ($)');
  
  linepath.append('path')
    .attr('class', 'line')
    .attr('d', line(stocks));
  
  focus.append('circle')
    .attr('class', 'y')
    .style('fill', 'none')
    .style('stroke', 'blue')
    .attr('r', 4);
  
  const mousemove = () => {
    const coordX = d3.event.layerX;
    const date0 = xScale.invert(coordX);
    const i = bisectDate(stocks, date0, 1);
    const d0 = stocks[i - 1];
    const d1 = stocks[i];
    let d = null;
    if ((date0 - parseTime(d0.date)) > (parseTime(d1.date) - date0)) {
      d = d1;
    } else {
      d = d0;
    }
    focus.select('circle.y')
      .attr('transform', `translate(${coordX}, ${yScale(d.close)})`);
    tooltip.transition().duration(200).style('opacity', 0.9);
    tooltip.html(`<span>${d.date}<br/>Close: ${formatCurrency(d.close)}</span>`)
      .style('left', `${coordX}px`)
      .style('top', `${(yScale(d.close) - 28)}px`);
  };
  
  // append a rect element to capture mouse events
  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', () => focus.style('display', null))
    .on('mouseout', () => focus.style('display', 'none'))
    .on('mousemove', mousemove);
  