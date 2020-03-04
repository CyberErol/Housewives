const select = document.querySelector("#select")

url = "http://andmebaas.stat.ee/sdmx-json/data/PA624/1.1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20.1/all?startTime=2010&endTime=2014&dimensionAtObservation=allDimensions"
fetch(url).then(raw => {return raw.json()}).then(data => {
	let fields = data.structure.dimensions.observation[1].values
	fields.forEach(i => {
		let opt = document.createElement("option")
		opt.innerText = i.name;
		select.appendChild(opt)
		console.log(i.name)
	})
	obs = data.dataSets[0].observations
	for(item in obs){
		let arrI = item.split(":")
	}
})
