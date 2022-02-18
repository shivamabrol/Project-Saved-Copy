class PieChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 10, bottom: 30, right: 10, left: 10 },
            tooltipPadding: _config.tooltipPadding || 15,
            keylist: _config.keylist,
            title: _config.title || 'Data'
        }

        this.data = _data;
        // this.data2= _data2
        //console.log(this.data);
        //console.log(this.data2);
        // Call a class function
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.marin = vis.config.margin.left;

        vis.radius = Math.min(vis.width, vis.height) / 2 - vis.marin;

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.width / 2},${vis.height / 2})`);

        vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
        vis.colorPalette.domain(['GoodDays', 'HazardousDays', 'UnhealthyDays', 'ModerateDays', 'UnhealthyforSensitiveGroupsDays', 'VeryUnhealthyDays']);
        // vis.colorPalette.domain(vis.keylist);
        this.updateVis()
    }

    updateVis() {
        let vis = this;
       // console.log('data')
        vis.pie = d3.pie()
            .value(function (d) {
               // console.log(d);
                return d.value
            })
        //vis.data_ready = vis.pie(Object.entries(vis.data));
        vis.data_ready = vis.pie(vis.data);
        //console.log('data ready');

        vis.keysAll = [];
        vis.data.forEach(d => {
            //console.log(d);
            vis.keysAll.push(d.key)});
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        
        vis.keys = vis.keysAll.filter(onlyUnique);
        // console.log(vis.keysAll);
        // console.log(vis.keys);

        vis.svg.selectAll("mydots")
            .data(vis.keys)
            .enter()
            .append("circle")
            .attr("cx", 500)
            .attr("cy", function (d, i) { return 10 + i * 25 }) 
            .attr("r", 4)
            .style("fill", function (d) { return vis.colorPalette(d) })

        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(vis.keys)
            .enter()
            .append("text")
            .attr("x", 520)
            .attr("y", function (d, i) { return 10 + i * 25 }) 
            .style("fill", function (d) { return vis.colorPalette(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", vis.width/2 + 40)
            .attr("y", vis.height - 350)
            .text(vis.config.title);


        vis.pie = vis.chart.selectAll('whatever')
            .data(vis.data_ready)
            .enter()
            .append('path')
            //.join('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(vis.radius)
            )
            .attr('fill', (d) =>
                vis.colorPalette(d.data.key)
            )
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        vis.pie
            .on('mouseover', (event,d) => {
              d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                  <div class="tooltip-title">${vis.config.title}</div>
                  <div><i>${d.data.key}</i></div>
                  <ul>
                    <li>${d.value}</li>
                 
                  </ul>
                `);
            })
            .on('mouseleave', () => {
              d3.select('#tooltip').style('display', 'none');
            });

        console.log('pie chart working')
    }

}