var urlEmpleado = 'https://api.coindesk.com/v1/bpi/currentprice.json';
new Vue({
	el: '#main',
	created: function() {
		this.getUsers();
	},
	data: {
		lists: []
	},
	methods: {
		getUsers: function() {
			axios.get(urlEmpleado).then(response => {
				this.lists = response.data
			});
		}
	}
});