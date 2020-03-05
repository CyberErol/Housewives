const select = document.querySelector("#select")
const tot = document.querySelector("#tot")
const num = document.querySelector("#num")
const btn = document.querySelector("#btn")
const form = document.querySelector("#form")
const itemList = document.querySelector("#itemList")
const dateElm = document.querySelector("#date")
const chartElm = document.querySelector("#chart").getContext("2d")
const errorlist = document.querySelector("#errorlist")

fetch("./names.json").then(raw => {return raw.json()}).then(data => {
	for(item in data){
		let opt = document.createElement("option")
		opt.innerText = data[item];
		opt.value = item;
		select.appendChild(opt)
	}

	form.addEventListener("submit", e => {
		errorlist.innerText = ""
		e.preventDefault()
		let field = select.children[select.selectedIndex]
		date = moment(dateElm.value, "DD.MM.YYYY");
		if(date.isValid()){
			let hour = parseFloat(num.value)
			if(hour > 0){
				let url = "http://andmebaas.stat.ee/sdmx-json/data/PA633/" + field.value + ".3.1/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"
				fetch(url).then(raw => {return raw.json()}).then(data => {
					let sum = data.dataSets[0].observations["0:0:0:0"][0] * hour;
					new Entry(field.innerText, hour, date, sum)
				})
			}else{
				errorlist.innerText = "tunde ei saa olla vähem kui null"
			}
		}else{
			errorlist.innerText = "Kuupäev on vale"
		}
	})
});

function Entry(name, hour, date, sum){
	this.name = name;
	this.hour = parseInt(hour);
	this.sum = sum;
	this.date = date;

	this.rm = function(){
		calc.ents.splice(calc.ents.indexOf(this), 1)
		this.elm.remove();
		calc.tot();
	}

	this.elm = document.createElement("div")

	var dateElm = document.createElement("SPAN")
	dateElm.innerText = this.date.format("DD.MM.YYYY");
	this.elm.appendChild(dateElm)

	var nameElm = document.createElement("SPAN")
	nameElm.innerText = name
	this.elm.appendChild(nameElm)

	var hourElm = document.createElement("SPAN")
	hourElm.innerText = this.hour;
	this.elm.appendChild(hourElm)

	var sumElm = document.createElement("SPAN")
	sumElm.innerText = (Math.round((this.sum + Number.EPSILON) * 100) / 100) + "€";
	this.elm.appendChild(sumElm)

	var btnElm = document.createElement("button")
	btnElm.innerText = "×"
	this.elm.appendChild(btnElm)

	btnElm.addEventListener("click", e => {
		this.rm();
	})

	calc.ents.push(this);
	calc.add(this.elm);

	calc.tot();
}

let calc = {
	ents: [],
	total: 0,
	tot: function(){
		btn.disabled = true;
		if(this.ents.length == 0){
			tot.innerText = "0";

			chart.data.datasets[0].data = []
			chart.data.datasets[0].backgroundColor = []

			chart.update()
			btn.disabled = false;
		}else{
			var res = 0;
			this.ents.forEach((item, i) => {
				res += item.sum;
			})
			tot.innerText = (Math.round((res + Number.EPSILON) * 100) / 100);

			chart.data.labels = this.ents.map(i => {return i.name})

			chart.data.datasets[0].data = []
			chart.data.datasets[0].backgroundColor = []

			fetch("./colors.json").then(raw => raw.json()).then(data=>{
				this.ents.forEach(item => {
					chart.data.datasets[0].data.push(item.sum)
					chart.data.datasets[0].backgroundColor.push(data[item.name])
					chart.data.datasets[0].borderColor.push("#000")
					chart.update()
					btn.disabled = false;
				})
			})
		}
	},
	add: function(elm){
		itemList.appendChild(elm)
	}
}

let chart = new Chart(chartElm, {
	type: 'pie',
	data: {
		labels: [],
		datasets: [{
			label: '# of hours',
			data: [],
			backgroundColor: [],
			borderColor: [],
			borderWidth: 1
		}]
	},
	options: { }
})
