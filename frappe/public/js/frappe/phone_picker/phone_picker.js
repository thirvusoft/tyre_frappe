class Picker {
	constructor(opts) {
		this.parent = opts.parent;
		this.width = opts.width;
		this.height = opts.height;
		this.country = opts.country;
		opts.country && this.set_country(opts.country);
		this.countries = opts.countries;
		this.setup_picker();
	}

	refresh() {
		this.update_icon_selected(true);
	}

	setup_picker() {
		this.icon_picker_wrapper = $(`
			<div class="phone-picker">
				<div class="search-phones">
					<input type="search" placeholder="Search for countries.." class="form-control">
					<span class="search-phone">${frappe.utils.icon('search', "sm")}</span>
				</div>
				<div class="phone-section">
					<div class="phones"></div>
				</div>
			</div>
		`);
		this.parent.append(this.icon_picker_wrapper);
		this.icon_wrapper = this.icon_picker_wrapper.find('.phones');
		this.search_input = this.icon_picker_wrapper.find('.search-phones > input');
		this.refresh();
		this.setup_icons();
	}

	setup_icons() {

		Object.entries(this.countries).forEach(([country, info]) => {
		let $country = $(`<div id="${country.toLowerCase()}" class="phone-wrapper">${frappe.utils.flag(info.code, "md")}<span class="country">${country}</span></div>`);
		this.icon_wrapper.append($country);
		const set_values = () => {
			this.set_country(country);
			this.update_icon_selected();
		};
		$country.on('click', () => {
			set_values();
		});
		$country.hover(() => {
			$country.toggleClass("bg-gray-100");
		 });
		this.search_input.keydown((e) => {
			const key_code = e.keyCode;
			if ([13].includes(key_code)) {
				e.preventDefault();
				set_values();
			}
		});
		this.search_input.keyup((e) => {
			e.preventDefault();
			this.filter_icons();
		});

		this.search_input.on('search', () => {
			this.filter_icons();
		});
	});
	}

	filter_icons() {
		let value = this.search_input.val();
		if (!value) {
			this.icon_wrapper.find(".phone-wrapper").removeClass('hidden');
		} else {
			this.icon_wrapper.find(".phone-wrapper").addClass('hidden');
			this.icon_wrapper.find(`.phone-wrapper[id*='${value.toLowerCase()}']`).removeClass('hidden');
		}
	}

	update_icon_selected(silent) {
		!silent && this.on_change && this.on_change(this.get_country());
	}

	set_country(country) {
		this.country = country || '';
	}

	get_country() {
		if (!this.country) return frappe.utils.icon("down", "sm")
		return this.country;
	}
}

export default Picker;
