// Load CSV data and create visualizations
d3.csv("spending_totals.csv").then(function(data) {
    // Convert numeric values from strings to numbers
    data.forEach(d => {
        d.year = +d.year;
        d.total = +d.total;
        d.costumes = +d.costumes;
        d.candy = +d.candy;
        d.decorations = +d.decorations;
        d.cards = +d.cards;
    });

    // Set up dimensions and margins for the line chart
    const lineChartWidth = 600;
    const lineChartHeight = 400;
    const lineChartMargin = {top: 50, right: 30, bottom: 50, left: 60};

    // Line chart scales
    const xScaleLine = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([lineChartMargin.left, lineChartWidth - lineChartMargin.right]);

    const yScaleLine = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)]).nice()
        .range([lineChartHeight - lineChartMargin.bottom, lineChartMargin.top]);

    // Create SVG for line chart
    const lineChartSvg = d3.select("#line-chart")
        .append("svg")
        .attr("width", lineChartWidth)
        .attr("height", lineChartHeight);

    // Line generator
    const line = d3.line()
        .x(d => xScaleLine(d.year))
        .y(d => yScaleLine(d.total));

    // Draw line for total spending
    lineChartSvg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // X-axis for line chart
    lineChartSvg.append("g")
        .attr("transform", `translate(0,${lineChartHeight - lineChartMargin.bottom})`)
        .call(d3.axisBottom(xScaleLine).tickFormat(d3.format("d")));

    // Y-axis for line chart
    lineChartSvg.append("g")
        .attr("transform", `translate(${lineChartMargin.left},0)`)
        .call(d3.axisLeft(yScaleLine));

    // Add title
    lineChartSvg.append("text")
        .attr("x", (lineChartWidth / 2))
        .attr("y", lineChartMargin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Total Spending Over the Years");

    // Set up dimensions and margins for the stacked bar chart
    const barChartWidth = 600;
    const barChartHeight = 400;
    const barChartMargin = {top: 50, right: 30, bottom: 50, left: 60};

    // Stack data preparation
    const categories = ["costumes", "candy", "decorations", "cards"];
    const stack = d3.stack().keys(categories);
    const series = stack(data);

    // Bar chart scales
    const xScaleBar = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([barChartMargin.left, barChartWidth - barChartMargin.right])
        .padding(0.1);

    const yScaleBar = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)]).nice()
        .range([barChartHeight - barChartMargin.bottom, barChartMargin.top]);

    const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

    // Create SVG for stacked bar chart
    const barChartSvg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("width", barChartWidth)
        .attr("height", barChartHeight);

    // Draw stacked bars
    barChartSvg.selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScaleBar(d.data.year))
        .attr("y", d => yScaleBar(d[1]))
        .attr("height", d => yScaleBar(d[0]) - yScaleBar(d[1]))
        .attr("width", xScaleBar.bandwidth());

    // X-axis for bar chart
    barChartSvg.append("g")
        .attr("transform", `translate(0,${barChartHeight - barChartMargin.bottom})`)
        .call(d3.axisBottom(xScaleBar).tickFormat(d3.format("d")));

    // Y-axis for bar chart
    barChartSvg.append("g")
        .attr("transform", `translate(${barChartMargin.left},0)`)
        .call(d3.axisLeft(yScaleBar));

    // Add title
    barChartSvg.append("text")
        .attr("x", (barChartWidth / 2))
        .attr("y", barChartMargin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Spending Breakdown by Category");
});

