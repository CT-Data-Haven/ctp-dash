d3.queue()
    .defer(d3.csv, '../data/underemployment.csv')
    .defer(d3.csv, '../data/underemployment_time.csv')
    .await(init);

///////////// INIT
function init(error, rates, trend) {
    if (error) throw error;

    rates.forEach(function(d) {
        d.Underemployment = +d.Underemployment;
    });

    trend.forEach(function(d) {
        d.Underemployment = +d.Underemployment;
    });

    var locationChart = makeBars3(rates);
    var trendChart = makeTrend(trend);

    d3.select(window).on('resize', function() {
        locationChart.draw(0, true);

        trendChart = makeTrend(trend);
    });

    d3.selectAll('.dimple-marker')
        .attr('r', 3);
}


function makeBars3(csv) {
    var margin = { top: 12, right: 18, bottom: 40, left: 100 };
    var svg = d3.select('#underemployment-chart')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');
        // .attr('viewBox', '0 0 ' + fullwidth + ' ' + fullheight);
    var chart = new dimple.chart(svg, csv);
    chart.setMargins(margin.left, margin.top, margin.right, margin.bottom);
    chart.defaultColors = [
        new dimple.color('#992156')
    ];

    var y = chart.addCategoryAxis('y', 'Location');
    y.addOrderRule(['CT', 'GNH', 'New Haven', 'NHV low-income', 'Other NHV'], true);
    y.title = null;

    var x = chart.addMeasureAxis('x', 'Underemployment');
    // x.title = '';
    x.tickFormat = '.0%';
    x.ticks = 6;
    x.title = null;


    var bars = chart.addSeries(null, dimple.plot.bar);

    chart.draw();

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(barTip);

    svg.selectAll('rect')
        .call(tip)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    return chart;
}


function makeTrend(csv) {
    var margin = { top: 24, right: 32, bottom: 48, left: 32 };

    var svg = d3.select('#underemployment-trend')
        .select('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .html('');
        // .attr('viewBox', '0 0 ' + width + ' ' + height);

    var chart = new dimple.chart(svg, csv);
    chart.setMargins(margin.left, margin.top, margin.right, margin.bottom);

    var x = chart.addTimeAxis('x', 'Year', '%Y', '%Y');
    x.title = null;

    var y = chart.addMeasureAxis('y', 'Underemployment');
    y.tickFormat = '.0%';
    y.ticks = 6;

    chart.defaultColors = [
        new dimple.color('#992156'),
        new dimple.color('#739DD0')
    ];

    // var baseline = chart.addSeries(null, dimple.plot.line);
    var colorline = chart.addSeries('Type', dimple.plot.line);
    colorline.lineMarkers = true;

    chart.addLegend('80%', '8%', '10%', '20%', 'right', colorline);
    chart.draw();

    d3.select('#dimple-goal')
        .style('stroke-dasharray', ('5, 5'));

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(lineTip);

        svg.selectAll('circle')
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    return chart;
}

function barTip(d) {
    return '<span>' + d.y + ': ' + d3.format('.0%')(d.xValue) + '</span>';
}

function lineTip(d) {
    return '<span>' + d3.timeFormat('%Y')(d.x) + ': ' + d3.format('.0%')(d.yValue) + '</span>';
}


// using d3fc
// function makeBars(csv) {
//     var bars = fc.seriesSvgBar()
//         // .orient('horizontal')
//         .crossValue(function(d) { return d.Location; })
//         .mainValue(function(d) { return d.Underemployment; })
//         .decorate(function(sel) {
//             sel.enter()
//                 .append('text')
//                 .attr('class', 'bar-label')
//                 .attr('transform', 'translate(0, -5)')
//                 .text(function(d) { return d3.format('.0%')(d.Underemployment); });
//         });
//
//     var yExtent = fc.extentLinear()
//         .include([0])
//         .pad([0, 0.1])
//         .accessors([function(d) { return d.Underemployment; }]);
//
//     // var xaxis = fc.axisBottom(d3.scaleBand())
//     //     .decorate(function(sel) {
//     //         sel.enter()
//     //             .select('text')
//     //             .style('text-anchor', 'start')
//     //             .attr('transform', 'rotate(45 -10 10)');
//     //     });
//
//     var chart = fc.chartSvgCartesian(d3.scalePoint(), d3.scaleLinear())
//         .xDomain(csv.map(function(d) { return d.Location; }))
//         .xPadding(0.5)
//         .yDomain(yExtent(csv))
//         .yOrient('none')
//         // .xDecorate(function(sel) {
//         //     sel.enter()
//         //         .select('text')
//         //         .style('text-anchor', 'start')
//         //         .attr('transform', 'rotate(45 -10 10)');
//         // })
//         .plotArea(bars);
//     //
//     // var series = fc.seriesSvgBar()
//     //     .orient('horizontal')
//     //     .crossValue(function(d) { return d.Location; })
//     //     .mainValue(function(d) { return d.Underemployment; });
//     //
//     // var xextent = fc.extentLinear()
//     //     .include([0])
//     //     .pad([0, 0.1])
//     //     .accessors([function(d) { return d.Underemployment; }]);
//     //
//     // var chart = fc.chartSvgCartesian(d3.scaleLinear(), d3.scalePoint())
//     //     .xDomain(xextent(csv))
//     //     .yDomain(csv.map(function(d) { return d.Location; }))
//     //     .yOrient('left')
//     //     .yPadding([0.5])
//     //     .xTicks(6)
//     //     .xTickFormat(d3.format('.0%'))
//     //     .plotArea(series);
//
//
//     d3.select('#underemployment-chart')
//         .datum(csv)
//         .call(chart);
// }
