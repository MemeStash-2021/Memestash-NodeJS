const users = [
	{
		userId : 1,
		username : "Jackson",
	},
	{
		userId: 2,
		username: "Eva"
	},
	{
		userId: 3,
		username: "Watson"
	},
	{
		userId: 4,
		username: "Mori"
	},
	{
		userId: 5,
		username: "Ruiner"
	}
];

const cards = function (){
	let res = [];
	for(let i = 0; i<10; i++){
		res.push({
			id: i,
			name: `card ${i}`,
			image: "https://somelinkhere.com/what.png",
			description: "A interesting description",
			cost: 800
		});
	}
	return res;
};

module.exports = {
	users : users,
	cards : cards
};
