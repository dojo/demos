var base = location.href.split("/");
base.pop();
base = base.join("/");

dojoConfig = {
	async: true,
	packages: [{
		name : "demo",
		location : base
	}]
};