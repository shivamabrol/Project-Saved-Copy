
console.log("Hello world");

function secondLine(names) {


	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			data = data.filter(d => d.County == county)
			var svg = d3.select("svg");
			// svg.selectAll("*").remove();
			let state_county = document.getElementById("state_list").value;
			console.log(state_county)
			let minYear = d3.min(data, d => d.Year),
				maxYear = d3.max(data, d => d.Year),
				combinedData = [];

			let AQIData = []
			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i);
				let AQIVal = d3.sum(justThisYear, d => d.DayswithAQI);
				if (AQIVal >= 365) {
					AQIData.push({ "year": i, "value": 0, "type": "Missing" });
				} else {
					AQIData.push({ "year": i, "value": 365 - AQIVal, "type": "Missing" });
				}
			}

			let vis2 = new Line({
				'parentElement': '#vis2',
				'containerHeight': 300,
				'containerWidth': 600,
				'yLabel': 'Missing Days--------->',
				'title': 'Missing days vs Year'
			}, AQIData);



			// svg.selectAll("*").remove()

		})
		.catch(error => {
			console.error(error);
		});


}

function jsFunctions(names) {
	vis1(names)
	secondLine(names)
}

// var tooltipSpan = document.getElementById('tooltip-span');

// window.onmousemove = function (e) {
//     var x = e.clientX,
//         y = e.clientY;
//     tooltipSpan.style.top = (y + 20) + 'px';
//     tooltipSpan.style.left = (x + 20) + 'px';
// };


function vis1(names) {
	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			console.log('Trial DS');
			data = data.filter(d => d.County == county)
			var svg = d3.select("svg#vis1");
			var svg2 = d3.select("svg#vis2");
			var svg3 = d3.select("svg#vis5")
			var svg4 = d3.select("svg#vis4")
			var svg5 = d3.select("svg#vis5")
			var svg14 = d3.select("svg#vis14")
			svg.selectAll("*").remove();
			svg2.selectAll("*").remove();
			svg3.selectAll("*").remove();
			svg4.selectAll("*").remove();
			svg5.selectAll("*").remove();
			svg14.selectAll("*").remove();

			let state_county = document.getElementById("state_list").value;
			console.log(state_county)
			let minYear = parseInt(d3.min(data, d => d.Year)),
				maxYear = parseInt(d3.max(data, d => d.Year)),
				combinedData = [];

			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i); //only include the selected year
				let medianAQI = d3.sum(justThisYear, d => d.MedianAQI); //sum over the filtered array, for the cost field
				let percentile90AQI = d3.sum(justThisYear, d => d.Percentile90AQI); //sum over the filtered array, for the cost field
				let maxAQI = d3.sum(justThisYear, d => d.MaxAQI); //sum over the filtered array, for the cost field
				combinedData.push({ "year": i, "value": medianAQI, "type": "median" });
				combinedData.push({ "year": i, "value": percentile90AQI, "type": "percent" });
				combinedData.push({ "year": i, "value": maxAQI, "type": "max" });
			}

			let data2021 = data.filter(d => d.Year == 2020)
			data2021 = data2021[0]
			let DaysData = [];
			let pollutionData = []
			DaysData.push({ 'key': 'GoodDays', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'HazardousDays', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'UnhealthyDays', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'ModerateDays', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'UnhealthyforSensitiveGroupsDays', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'VeryUnhealthyDays', 'value': data2021.VeryUnhealthyDays })

			//			Removing Piechart so as to align the page better
			let dat = new PieChart({

				'parentElement': '#vis5',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'AQI Days'
			}, DaysData);

			let PollutionData = [];
			PollutionData.push({ 'key': 'CO', 'value': data2021.DaysCO })
			PollutionData.push({ 'key': 'NO2', 'value': data2021.DaysNO2 })
			PollutionData.push({ 'key': 'Ozone', 'value': data2021.DaysOzone })
			PollutionData.push({ 'key': 'SO2', 'value': data2021.DaysSO2 })
			PollutionData.push({ 'key': 'PM25', 'value': data2021.DaysPM25 })
			PollutionData.push({ 'key': 'PM10', 'value': data2021.DaysPM10 })

			let dat2 = new PieChart({

				'parentElement': '#vis14',
				'containerHeight': 400,
				'containerWidth': 650, 
				'title': 'Pollutant Days'
			}, PollutionData);


			let vis1 = new Line({
				'parentElement': '#vis1',
				'containerHeight': 300,
				'containerWidth': 600,
				'yLabel': 'AQI Days --------------->',
				'title': 'AQI data vs Year'
			}, combinedData);
			let Pdata = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			for (let i = minYear; i <= maxYear; i += 2) {
				let justThisYear = data.filter(d => d.Year == i);
				let d = justThisYear[0]
				// console.log(i)
				let maxKey = "";
				let maxIndex = (argMax([parseInt(d.DaysCO), parseInt(d.DaysNO2), parseInt(d.DaysOzone), parseInt(d.DaysSO2), parseInt(d.DaysPM25), parseInt(d.DaysPM10)]));
				switch (maxIndex) {
					case 0:
						maxKey = 'CO';
						break;
					case 1:
						maxKey = "NO2";
						break;
					case 2:
						maxKey = "Ozone";
						break;
					case 3:
						maxKey = "SO2";
						break;
					case 4:
						maxKey = "PM25";
						break;
					case 5:
						maxKey = "PM10";
						break;
					default:
						maxKey = "ND"
						break;
				}
				Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10, "maxIndex": maxKey })

			}

			let stacks = new StackChart({
				'parentElement': '#vis4',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);

			// let PollutantData = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	PollutantData.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			// let stacks = new StackChart({
			//   'parentElement': '#vis4',
			//   'containerHeight': 400,
			//   'containerWidth': 650
			// }, PollutantData);


		})
		.catch(error => {
			console.error(error);
		});
}

function jsFunctions2(names) {
	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			console.log('Trial DS');
			data = data.filter(d => d.County == county)
			data = data.filter(d => d.State == state)
			var svg = d3.select("svg#vis6");
			var svg2 = d3.select("svg#vis7");
			var svg9 = d3.select("svg#vis9")
			var svg10 = d3.select("svg#vis10")
			var svg11 = d3.select("svg#vis11")
			// var svg3 = d3.select("svg#vis5")
			// var svg4 = d3.select("svg#vis4")
			svg.selectAll("*").remove();
			svg2.selectAll("*").remove();
			svg9.selectAll("*").remove();
			svg10.selectAll("*").remove();
			svg11.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			// svg4.selectAll("*").remove();


			let state_county = document.getElementById("state_list_2").value;
			console.log(state_county)
			let minYear = parseInt(d3.min(data, d => d.Year)),
				maxYear = parseInt(d3.max(data, d => d.Year)),
				combinedData = [];

			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i); //only include the selected year
				let medianAQI = d3.sum(justThisYear, d => d.MedianAQI); //sum over the filtered array, for the cost field
				let percentile90AQI = d3.sum(justThisYear, d => d.Percentile90AQI); //sum over the filtered array, for the cost field
				let maxAQI = d3.sum(justThisYear, d => d.MaxAQI); //sum over the filtered array, for the cost field
				combinedData.push({ "year": i, "value": medianAQI, "type": "median" });
				combinedData.push({ "year": i, "value": percentile90AQI, "type": "percent" });
				combinedData.push({ "year": i, "value": maxAQI, "type": "max" });
			}

			let year_value = document.getElementById("year").value;
			if (year_value == 'year') {
				year_value = 2020
			}

			let data2021 = data.filter(d => d.Year == year_value)
			data2021 = data2021[0]
			let DaysData = [];
			DaysData.push({ 'key': 'GoodDays', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'HazardousDays', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'UnhealthyDays', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'ModerateDays', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'UnhealthyforSensitiveGroupsDays', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'VeryUnhealthyDays', 'value': data2021.VeryUnhealthyDays })

			let dat = new PieChart({

				'parentElement': '#vis10',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'AQI Days'
			}, DaysData);


			let PollutionData = [];
			PollutionData.push({ 'key': 'CO', 'value': data2021.DaysCO })
			PollutionData.push({ 'key': 'NO2', 'value': data2021.DaysNO2 })
			PollutionData.push({ 'key': 'Ozone', 'value': data2021.DaysOzone })
			PollutionData.push({ 'key': 'SO2', 'value': data2021.DaysSO2 })
			PollutionData.push({ 'key': 'PM25', 'value': data2021.DaysPM25 })
			PollutionData.push({ 'key': 'PM10', 'value': data2021.DaysPM10 })

			let dat2 = new PieChart({

				'parentElement': '#vis11',
				'containerHeight': 400,
				'containerWidth': 650, 
				'title': 'Pollutant Days'
			}, PollutionData);

			let vis1 = new Line({
				'parentElement': '#vis6',
				'containerHeight': 300,
				'containerWidth': 600,
				'yLabel': 'AQI Data------------->',
				'title': 'AQI Data vs Year'
			}, combinedData);


			let AQIData = []
			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i);
				let AQIVal = d3.sum(justThisYear, d => d.DayswithAQI);
				if (AQIVal >= 365) {
					AQIData.push({ "year": i, "value": 0, "type": "Missing" });
				} else {
					AQIData.push({ "year": i, "value": 365 - AQIVal, "type": "Missing" });
				}
			}

			let vis2 = new Line({
				'parentElement': '#vis7',
				'containerHeight': 300,
				'containerWidth': 600,
				'yLabel': 'Missing Days ------------>'
			}, AQIData);
			// code works but need for later




			let Pdata = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			for (let i = minYear; i <= maxYear; i += 2) {
				let justThisYear = data.filter(d => d.Year == i);
				let d = justThisYear[0]
				// console.log(i)
				let maxKey = "";
				let maxIndex = (argMax([parseInt(d.DaysCO), parseInt(d.DaysNO2), parseInt(d.DaysOzone), parseInt(d.DaysSO2), parseInt(d.DaysPM25), parseInt(d.DaysPM10)]));
				switch (maxIndex) {
					case 0:
						maxKey = 'CO';
						break;
					case 1:
						maxKey = "NO2";
						break;
					case 2:
						maxKey = "Ozone";
						break;
					case 3:
						maxKey = "SO2";
						break;
					case 4:
						maxKey = "PM25";
						break;
					case 5:
						maxKey = "PM10";
						break;
					default:
						maxKey = "ND"
						break;
				}
				Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10, "maxIndex": maxKey })

			}

			let stacks = new StackChart({
				'parentElement': '#vis9',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);





		})
		.catch(error => {
			console.error(error);
		});
}
function yearDD(year) {
	yearCharts(year)
	let v = document.getElementById("metric_list").value;
	metricDD(v)
}
function yearCharts(year) {
	// let passVal = document.getElementById('metric_list').value
	// metricDD(passVal)
	let year_data = parseInt(year)

	d3.csv('data/ohio.csv')
		.then(data => {
			let data_1 = data;
			let state_county = document.getElementById("state_list").value;
			let state_county_1 = document.getElementById("state_list_2").value;

			// console.log('Trial DS');
			let s_c = state_county.split(',');
			let s_c_1 = state_county_1.split(',');

			data = data.filter(d => d.County == s_c[1])
			data = data.filter(d => d.State == s_c[0])


			data_1 = data_1.filter(d => d.County == s_c_1[1])
			data_1 = data_1.filter(d => d.State == s_c_1[0])

			var svg = d3.select("svg#vis6");
			var svg2 = d3.select("svg#vis7");
			var svg9 = d3.select("svg#vis9")
			// var svg3 = d3.select("svg#vis5")
			var svg4 = d3.select("svg#vis4")
			// svg.selectAll("*").remove();
			// svg2.selectAll("*").remove();
			svg9.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			svg4.selectAll("*").remove();



			let Pdata = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			let justThisYear = data.filter(d => d.Year == year_data);
			let d = justThisYear[0]
			// console.log(i)
			if (d != undefined) {
				let maxKey = "";
				let maxIndex = (argMax([parseInt(d.DaysCO), parseInt(d.DaysNO2), parseInt(d.DaysOzone), parseInt(d.DaysSO2), parseInt(d.DaysPM25), parseInt(d.DaysPM10)]));
				switch (maxIndex) {
					case 0:
						maxKey = 'CO';
						break;
					case 1:
						maxKey = "NO2";
						break;
					case 2:
						maxKey = "Ozone";
						break;
					case 3:
						maxKey = "SO2";
						break;
					case 4:
						maxKey = "PM25";
						break;
					case 5:
						maxKey = "PM10";
						break;
					default:
						maxKey = "ND"
						break;
				}
				Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10, "maxIndex": maxKey })
			}


			let stacks = new StackChart({
				'parentElement': '#vis9',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);

			let Pdata_2 = [];
			let justThisYear_1 = data_1.filter(d => d.Year == year_data);
			d = justThisYear_1[0]
			// console.log(i)
			if (d != undefined) {
				let maxKey = "";
				let maxIndex = (argMax([parseInt(d.DaysCO), parseInt(d.DaysNO2), parseInt(d.DaysOzone), parseInt(d.DaysSO2), parseInt(d.DaysPM25), parseInt(d.DaysPM10)]));
				switch (maxIndex) {
					case 0:
						maxKey = 'CO';
						break;
					case 1:
						maxKey = "NO2";
						break;
					case 2:
						maxKey = "Ozone";
						break;
					case 3:
						maxKey = "SO2";
						break;
					case 4:
						maxKey = "PM25";
						break;
					case 5:
						maxKey = "PM10";
						break;
					default:
						maxKey = "ND"
						break;
				}
				Pdata_2.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10, "maxIndex": maxKey })
			}

			let newstacks = new StackChart({
				'parentElement': '#vis4',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata_2);


			var svg5 = d3.select("svg#vis5");
			// svg.selectAll("*").remove();
			// svg2.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			svg5.selectAll("*").remove();

			let data2021 = data.filter(d => d.Year == year)
			data2021 = data2021[0]


			// code works but need for later
			let DaysData = [];

			DaysData.push({ 'key': 'GoodDays', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'HazardousDays', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'UnhealthyDays', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'ModerateDays', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'UnhealthyforSensitiveGroupsDays', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'VeryUnhealthyDays', 'value': data2021.VeryUnhealthyDays })


			let dayschart = new PieChart({

				'parentElement': '#vis5',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'AQI Days'
			}, DaysData);


			var svg10 = d3.select("svg#vis10");
			// svg.selectAll("*").remove();
			// svg2.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			svg10.selectAll("*").remove();

			let data2021_1 = data_1.filter(d => d.Year == year)
			data2021_1 = data2021_1[0]


			// code works but need for later
			let DaysData_1 = [];

			DaysData_1.push({ 'key': 'GoodDays', 'value': data2021_1.GoodDays })
			DaysData_1.push({ 'key': 'HazardousDays', 'value': data2021_1.HazardousDays })
			DaysData_1.push({ 'key': 'UnhealthyDays', 'value': data2021_1.UnhealthyDays })
			DaysData_1.push({ 'key': 'ModerateDays', 'value': data2021_1.ModerateDays })
			DaysData_1.push({ 'key': 'UnhealthyforSensitiveGroupsDays', 'value': data2021_1.UnhealthyforSensitiveGroupsDays })
			DaysData_1.push({ 'key': 'VeryUnhealthyDays', 'value': data2021_1.VeryUnhealthyDays })


			let dayschart_1 = new PieChart({

				'parentElement': '#vis10',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'AQI Days'

			}, DaysData_1);



			var svg0 = d3.select("svg#vis11");
			var svg1 = d3.select("svg#vis14");
			svg0.selectAll('*').remove();
			svg1.selectAll('*').remove()

			let PollutionData = [];
			PollutionData.push({ 'key': 'CO', 'value': data2021.DaysCO })
			PollutionData.push({ 'key': 'NO2', 'value': data2021.DaysNO2 })
			PollutionData.push({ 'key': 'Ozone', 'value': data2021.DaysOzone })
			PollutionData.push({ 'key': 'SO2', 'value': data2021.DaysSO2 })
			PollutionData.push({ 'key': 'PM25', 'value': data2021.DaysPM25 })
			PollutionData.push({ 'key': 'PM10', 'value': data2021.DaysPM10 })

			let dat2 = new PieChart({

				'parentElement': '#vis14',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'Pollutant Days'
			}, PollutionData);
	
			let PollutionData_1 = [];
			PollutionData_1.push({ 'key': 'CO', 'value': data2021_1.DaysCO })
			PollutionData_1.push({ 'key': 'NO2', 'value': data2021_1.DaysNO2 })
			PollutionData_1.push({ 'key': 'Ozone', 'value': data2021_1.DaysOzone })
			PollutionData_1.push({ 'key': 'SO2', 'value': data2021_1.DaysSO2 })
			PollutionData_1.push({ 'key': 'PM25', 'value': data2021_1.DaysPM25 })
			PollutionData_1.push({ 'key': 'PM10', 'value': data2021_1.DaysPM10 })

			let dat4 = new PieChart({

				'parentElement': '#vis11',
				'containerHeight': 400,
				'containerWidth': 650,
				'title': 'Pollutant Days'
			}, PollutionData_1);

		})
		.catch(error => {
			console.error(error);
		});

}

function metricDD(val) {

	Promise.all([
		d3.json('data/counties-10m.json'),
		d3.csv('data/fips.csv'),
		d3.csv('data/ohio.csv')
	]).then(data => {
		const geoData = data[0];
		const countyFips = data[1];
		const ohioData = data[2];
		// Combine both datasets by adding the population density to the TopoJSON file
		geoData.objects.counties.geometries.forEach(d => {
			for (let i = 0; i < countyFips.length; i++) {
				if (d.id == countyFips[i].cnty_fips) {
					// console.log(d);
					//console.log(countyFips[i]);
					let year = document.getElementById("year").value;

					let countyInfo = ohioData.filter(d => d.Year == year).filter(d => d.State == countyFips[i].state).filter(d => d.County == countyFips[i].county)
					//  console.log(countyInfo);
					let final_value = 0
					// var svg_map = d3.select("svg#map")
					if (countyInfo.length != 0) {
						switch (val) {
							case 'MaxAQI':
								final_value = countyInfo[0].MaxAQI;
								break;
							case 'Percentile90AQI':
								final_value = countyInfo[0].Percentile90AQI;
								break;
							case 'MedianAQI':
								final_value = countyInfo[0].MedianAQI;
								break;
							case 'DaysCO':
								final_value = countyInfo[0].DaysCO;
								break;
							case 'DaysNO2':
								final_value = countyInfo[0].DaysNO2;
								break;
							case 'DaysSO2':
								final_value = countyInfo[0].DaysSO2;
								break;
							case 'DaysPM25':
								final_value = countyInfo[0].DaysPM25;
							case 'DaysPM10':
								final_value = countyInfo[0].DaysPM10;
							default:
								final_value = 0
						}
							d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': final_value, 'type': val };
							d.properties.value = +d.properties.value;
					}
					else {
						d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': 0, 'type': val };
						d.properties.value = +d.properties.value;
					}
					// console.log(d.properties);
				}
			}
		});
		
		
		var svg_map = d3.select(".viz")
		svg_map.selectAll("*").remove();
		const choroplethMap = new ChoroplethMap({
			parentElement: '.viz',
			parameter: val

		}, geoData);

		// svg_map.selectAll("*").remove();

	})
		.catch(error => console.error(error));
}

function argMax(array) {
	return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}