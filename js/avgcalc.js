var FILERENUM = (function() {
	var filerenum = {};
	
	filerenum.Debtor = "db";
	filerenum.JointDebtor = "jdb";
	
	return filerenum;
}());

var AVG_CALCULATOR = (function() {
	var ac = {};
	var m_for_who_id_prefix = "grossInc_";
	var m_for_who = "db"; // Default to Debtor 'db'.  This is part of the 'id' for the Debtor's 'input' tag.  'jdb' for Joint Debtor.
	var m_check_inputs = [];
	var m_check_inputs_ids = []
	var m_check_inputs_values = {};
	var m_DEFAULT_INPUT_NUM = 13;
	var m_DEFAULT_START_AMT = 0;
	var m_num_check_inputs = m_DEFAULT_INPUT_NUM;
	var m_starting_gross_amt = m_DEFAULT_START_AMT;
	var m_starting_average = m_DEFAULT_START_AMT;
	var m_last_entered_total = 0;
	var m_index_last_total = 0;
	var m_id_last_total = "";
	var m_total_checks_id = "total_checks";
	var m_avgincmodal_body_id = "avgincmodal_body";
	var m_gross_inc_amt_id = "gross_inc_amt";
	var m_avg_monthly_inc_id = "avg_monthly_inc";
	var m_totals_accordion_id = "collapseTotals";
	var m_modal_panel_body_id = "totals_panel_body";
	var m_btn_close_avgcalc = "btn_close_avgcalc";
		
	var init = (function () { 
		// Create the first 13 check inputs and store them.
		m_check_inputs = create_check_inputs(m_num_check_inputs);
	}());
	
	/**
     * Create 'count' number of 'input' nodes for
	 * the user to enter check amounts into.
	 */
	function create_check_inputs(count) {
		var check_inputs = [];
		var i = 0;
		m_check_inputs_ids = []; // Clear this.
		
		for (i; i < count; i++) {			
			var display_id = i + 1; // non-zero index, for user consumption.
			var new_id = "check_input_" + display_id;
			var new_label_text = "Check " + display_id + ":";
			
			// Add new id to the id array
			m_check_inputs_ids.push(new_id);
			
			check_inputs.push("<label for=\"" + new_id + "\" class=\"col-sm-2 form-control-label chkinputlabel\" >" + new_label_text + "</label><div class=\"col-sm-10\"><input type=\"text\" class=\"form-control\" id=\"" + new_id + "\" placeholder=\"$\" onchange=\"AVG_CALCULATOR.input_value_changed(this);\" ></div>");
		}
		return check_inputs;
	}
	
	/**
	 * Create the top portion of this modal window.
	 */
	function create_top_section() {
		var ret = "<form class=\"form-horizontal\" role=\"form\">"; 
		ret += "<div class=\"form-group-sm row\">";
		ret += "<div class=\"input-append\">";
		ret += "<label for=\"total_checks\" class=\"col-sm-2 form-control-label label_three\">Total checks? (1-26)</label>";
		ret += "<div class=\"controls col-sm-10\">";
		ret += "<input type=\"number\" class=\"form-control\" id=\"total_checks\" min=\"1\" max=\"26\"  placeholder=\"Arrow Key Up and Down to change\"  onchange=\"AVG_CALCULATOR.set_total_check_inputs(this);\" />";
		ret += "</div></div></div>"; 
		ret += "</form>";
				
		ret += "<form class=\"form-inline\" role=\"form\">" +
		"<div class=\"form-group\">" +
		"<label for=\"starting_amt\" class=\"label_one\" >Starting Amount: $</label>" +
		"<label class=\"label_two\" id=\"starting_amt\">0</label>" +
		"</div>" +
		"<div class=\"form-group\">" +
		"<label for=\"starting_avg\" class=\"label_one\">Starting Average: $</label>" +
		"<label class=\"label_two\" id=\"starting_avg\">0</label>" +
		"</div>" +
		"<div class=\"form-group\">" +
		"<button type=\"button\" class=\"btn-xs btn-link right_side\" onclick=\"AVG_CALCULATOR.clear_starting_totals();\">Clear</button>" +
		"</div>" +
		"</form>" +
		"<hr>";
		
		ret += "<div class=\"btn-group btn-group-justified bcbtn\">" +
		"<a href=\"#\" class=\"btn btn-primary\" onclick=\"AVG_CALCULATOR.copy_amount_down();\" >Copy Amount Down</a>" +
		"</div>" +
		"<br>";
		
		return ret;
	}
	
	/**
	 * 
	 */
	function create_totals_section() {
		var ret = "<div class=\"container-fluid\">";
		ret += "<div class=\"row\">" +
		"<div class=\"col-sm-6\">" +
		"<label for=\"starting_amt\" class=\"label_one\">6-month Gross Income:</label>" +
		"</div>" +
		"<div class=\"col-sm-4\">" +
		"<label class=\"label_two\" id=\"gross_inc_amt\">$0</label>" +
		"</div>" +
		"</div>" +
		"<div class=\"row\">" +
		"<div class=\"col-sm-6\">" +
		"<label for=\"starting_amt\" class=\"label_one\">Average Monthly Income:</label>" +
		"</div>" +
		"<div class=\"col-sm-4\">" +
		"<input type=\"text\" id=\"avg_monthly_inc\" style=\"margin-right: 15px;\">" +
		"</div>" +
		"</div>" +
		"</div>" +
		"<br>" +
		"<div class=\"btn-group btn-group-justified\">" + 
		"<a href=\"#\" class=\"btn btn-info bcbtn\" onclick=\"AVG_CALCULATOR.btn_add_to_total_click();\">Add to Total</a>" +
		"<a href=\"#\" class=\"btn btn-info bcbtn\" onclick=\"AVG_CALCULATOR.write_total_back();\">Send to Quick CMI Calculator</a>" +
		"</div>";
		
		$('.' + m_modal_panel_body_id + '').html(ret);
		
		hide_totals_section();
	}
	
	/**
	 * 
	 */
	function create_bottom_section() {
		/* var ret = "<form class=\"form-horizontal\" role=\"form\">";
		ret += "</form>"; */
		
		var ret = "<br><div class=\"btn-group btn-group-justified\">" +
		"<a href=\"#\" class=\"btn btn-primary bcbtn\" onclick=\"AVG_CALCULATOR.compute_average();\">Calculate Avgerage Monthly Income</a>" +
		"</div>";
		
		return ret;
	}
	
	/**
	 * Get the check input boxes from their list and format
	 * them in proper divs for display.
	 */
	function get_inputs_for_display() {
		var ret = "<form class=\"form-horizontal\" role=\"form\">";
		m_check_inputs.forEach(function (item, index, array) {
			ret += "<div class=\"form-group-sm row\">";
			ret += item;
			ret += "</div>";
		});
		ret += "</form>";
				
		return ret;
	}
	
	/**
	 * 
	 */
	function set_starting_gross_amt(amount) {
		m_starting_gross_amt = amount;
		$('#starting_amt').html(m_starting_gross_amt);
	}
	
	/**
	 * 
	 */
	function set_starting_averge_amt(amount) {
		m_starting_average = amount;
		$('#starting_avg').html(m_starting_average);		
	}
	
	/**
	 * 
	 */
	function reset_totals_section() {
		$('#' + m_gross_inc_amt_id + '').html("$0");
		$('#' + m_avg_monthly_inc_id + '').val("");	
		
		hide_totals_section();
	}
	
	function hide_totals_section() {
		// Hide the Totals section
		$('#' + m_totals_accordion_id + '').collapse("hide");
	}
	
	/**
	 * 
	 */
	function get_inputs_values() {
		m_check_inputs_values = {}; // Reset and refill.
		m_check_inputs_ids.forEach(function (item, index, array) {
			m_check_inputs_values[item] = $('#' + item + '').val();
		});
	}	
	
	/**
	 * 
	 */
	function reset_check_inputs() {
		m_check_inputs_ids.forEach(function (item, index, array) {
			$('#' + item + '').val("");
		});
	}
	
	/**
	 * Return the array items as a string
	 * separated by 'sep'.
	 */
	function join(arr, sep) {
		var ret = "";
		arr.forEach(function (item, index, array) {
		  ret += item;
		  ret += sep;
		});
		return ret;
	}	
	
	//
	//PUBLIC
	//
	
	ac.window_title = "Calculate Average Gross Monthly Income";
		
	/**
	 * Set 'for_who', for who (whom?), the averaging of gross income
	 * is being done.  Either the Debtor or Joint Debtor.
	 * param: who This is one of the FILERENUM values.
	 */
	ac.set_forWho = function(who) {
		m_for_who = who;
	}
	
	/**
	 * Set the internal total of check inputs to create.
	 */
	ac.set_total_check_inputs = function(element) {
		// Store any existing entered amounts.
		get_inputs_values();
				
		//m_num_check_inputs = total;
		m_num_check_inputs = $(element).val();
		
		// Update the page
		ac.update_modal();
		
		// Restore any existing amounts.
		for (var key in m_check_inputs_values) {
			if (m_check_inputs_values.hasOwnProperty(key)) {
				$('#' + key + '').val(m_check_inputs_values[key]);
			}
		}
	}
	
	/**
	 * Update the body of the modal window that is the
	 * average income calculator.
	 */
	ac.update_modal = function() {
		// Re-create/update the inputs.
		m_check_inputs = create_check_inputs(m_num_check_inputs);		
	
		var modal_body 	 = create_top_section();
		modal_body 		+= get_inputs_for_display();
		modal_body 		+= create_bottom_section();
				
		$('#' + m_avgincmodal_body_id + '').html("");
		$('#' + m_avgincmodal_body_id + '').html(modal_body);
		
		create_totals_section();
				
		// Be sure the UI text box has the right total.
		$('#' + m_total_checks_id + '').val(m_num_check_inputs);
	}
	
	/**
	 * 
	 */
	ac.write_total_back = function() {
		var id = m_for_who_id_prefix + '' + m_for_who;
		var avg_inc = $('#' + m_avg_monthly_inc_id + '').val();
		
		$('#' + id + '').val(avg_inc);	// Set value back on main page.
		
		$('#' + m_btn_close_avgcalc + '').click();  // Close this window.		
	}
	
	/**
	 * 
	 */
	ac.clear_starting_totals = function() {
		set_starting_averge_amt(0);
		set_starting_gross_amt(0);
		
		// Clear totals section.
		clear_totals();
	}
	
	/**
	 * 
	 */
	ac.copy_amount_down = function() {
		var ind = m_index_last_total - 1;
		for (ind; ind < m_check_inputs_ids.length; ind++) {
			var item = m_check_inputs_ids[ind];
			$('#' + item + '').val(m_last_entered_total);
		}		
	}
	
	/**
	 * Each time a value is changed in one of the check input boxes
	 * this method is called.  The info about the input is saved.
	 */
	ac.input_value_changed = function(el) {		
		m_id_last_total = $(el).attr("id");
		m_last_entered_total = $(el).val();
		
		var id_parts = m_id_last_total.split("_");
		m_index_last_total = id_parts[2];
	}
	
	/**
	 * 
	 */
	ac.compute_average = function() {
		// To make the UI clear, I write the gross as a string starting 
		// with a dollar sign "$".  That needs to be trimmed off if we
		// want to work with the number.	
		var gross = m_starting_gross_amt.toString().substring(1);
		var gross = (0 < +gross) ? +gross : 0;
		var avg = (0 < +m_starting_average) ? +m_starting_average : 0;
		
		// Loop the check inputs and grab their values.
		get_inputs_values();
		
		for (var key in m_check_inputs_values) {
			if (m_check_inputs_values.hasOwnProperty(key)) {
				gross += +m_check_inputs_values[key];
			}
		}
		
		// Calculate the six month average
		avg = (gross / 6);
		
		//alert("gross: " + gross + " avg: " + avg.toFixed(2));
		
		// Post the results to the page.
		$('#' + m_gross_inc_amt_id + '').html("$" + gross.toString());
		$('#' + m_avg_monthly_inc_id + '').val(avg.toFixed(2));
		
		// Show the totals section
		$('#' + m_totals_accordion_id + '').collapse("show");
	}
	
	/**
	 * 
	 */
	ac.btn_add_to_total_click = function() {
		set_starting_gross_amt($('#' + m_gross_inc_amt_id + '').html());
		set_starting_averge_amt($('#' + m_avg_monthly_inc_id + '').val());
		
		ac.reset_screen();
	}
	
	/**
	 * 
	 */
	ac.reset_screen = function() {
		m_num_check_inputs = m_DEFAULT_INPUT_NUM;
		reset_check_inputs();	// Clear all check input values.		
		reset_totals_section();	// Collapse the Totals section.
		
	}
	
	/**
	 * 
	 */
	ac.btn_help_click = function() {
		/* var windowObjectReference;
		var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
		windowObjectReference = window.open("http://www.cnn.com/", "CNN_WindowName", strWindowFeatures); */
		var w = window.open();
		var html = "<!doctype html><html lang=\"en\"></html>";
		$(w.document.html).html('<object type="text/html" data="cmiCalc_help.html" ></object>');
	}
	
	return ac;
}());