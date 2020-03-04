const select = document.querySelector("#select")
const tot = document.querySelector("#tot")
const num = document.querySelector("#num")
const form = document.querySelector("#form")
const itemList = document.querySelector("#itemList")
const dateElm = document.querySelector("#date")

fetch("./names.json").then(raw => {return raw.json()}).then(data => {
	for(item in data){
		let opt = document.createElement("option")
		opt.innerText = data[item];
		opt.value = item;
		select.appendChild(opt)
	}

	form.addEventListener("submit", e => {
		e.preventDefault()
		let field = select.children[select.selectedIndex]
		let date = dateElm.value;
		let hour = num.value
		if(hour > 0){
			let url = "http://andmebaas.stat.ee/sdmx-json/data/PA633/" + field.value + ".3.1/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"
			fetch(url).then(raw => {return raw.json()}).then(data => {
				let sum = data.dataSets[0].observations["0:0:0:0"][0] * hour;
				new Entry(field.innerText, hour, date, sum)
			})
		}else{
			console.log("tunde ei saa olla vähem kui null")
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
	btnElm.innerText = "X"
	this.elm.appendChild(btnElm)

	btnElm.addEventListener("click", e => {
		this.rm();
	})

	calc.ents.push(this);
	calc.add(this.elm);

	calc.tot();
}

var calc = {
	ents: [],
	total: 0,
	tot: function(){
		var res = 0;
		this.ents.forEach((item, i) => {
			res += item.sum;
		})
		tot.innerText = (Math.round((res + Number.EPSILON) * 100) / 100);

	},
	add: function(elm){
		itemList.appendChild(elm)
	}
}
