const LOAD_NUM = 4;
let watcher = undefined;
new Vue({
	el: '#app',
	data: {
		total: 0,
		products: [
		],
		cart: [],
		search: 'cat',
		lastSearch: '',
		loading: false,
		results: []
	},
	filters: {
		currency: function(price) {
			return `$${price.toFixed(2)}`;
		}
	},
	created: function() {
		this.onSubmit();
	},
	updated: function() {
		const sensor = document.querySelector('#product-list-bottom');
		watcher = scrollMonitor.create(sensor);
		
		watcher.enterViewport(this.appendResults);
	},
	beforeUpdated: function() {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	},
	methods: {
		addToCart: function(product) {
			this.total += product.price;
			let found = false;
			for(let x = 0; x < this.cart.length; x++) {
				if (this.cart[x].id === product.id) {
					this.cart[x].qty++;
					found = true;
				}
			}
			if (!found) {
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1
				});
			}
		},
		inc: function(item) {
			item.qty++;
			this.total += item.price;
		},
		dec: function(item) {
			if (item.qty <= 0) {
				let i = this.cart.indexOf(item);
				this.cart.splice(i, 1);				
			}
			item.qty--;
			this.total -= item.price;
		},
		onSubmit: function() {
			this.products = [];
			this.results = [];
			this.loading = true;
			const path = 'search?q='.concat(this.search);
			this.$http.get(path)
				.then(function(response) {
					this.results = response.body;
					// this.products = response.body.slice(0, LOAD_NUM);
					this.lastSearch = this.search;
					this.appendResults();
					this.loading = false;
				});
		},
		appendResults: function() {
			if (this.products.length < this.results.length) {
				const toAppend = this.results.slice(this.products.length, LOAD_NUM + this.products.length);
				this.products = this.products.concat(toAppend);
			}
		}
	}
});
