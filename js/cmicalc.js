/**
 * This module contains the logic to do the current monthly income calculation
 * and present the results to the user.  It interacts mainly with cmiCalc.html.
 */
var CMI_CALCULATOR = (function() {
	var cc = {};
	var m_data = "";
	var m_data_map = {};
	var m_state = "";
	var m_household_size = 0;
	var m_over_four_multiplier = 8100;
	var m_debtor_inc = 0;
	var m_joint_inc = 0;
	// IDs
	var m_house_size_id = "house_size";
	var m_housesize_input_id = "houseSize";
	var m_lbl_state_median_inc_id = "lbl_state_med_inc";
	var m_state_med_inc_val_id = "state_med_inc_val";
	var m_gross_yearly_inc_id = "gross_yearly_inc";
	var m_debtor_inc_id = "grossInc_db";
	var m_joint_inc_id = "grossInc_jdb";
	var m_results_accordion_id = "collapseResults";
	var m_instrux_accordion_id = "collapseInstrux";
	var m_cmi_result_id = "cmi_result";
	var m_lbl_cmi_result_id = "lbl_cmi_result";
	var m_state_select_class = "state_select";
	var m_select_state_id = "sel_state";
	
	var init = (function() {
		m_data = MEDIAN_INCOME.get_median_income_data();
		
		var lines = m_data.split("\n");
		
		// Read and store in map, the median_income data.
		jQuery.each(lines, function (index, item) {
			var line = item.split(",");
			var key = line[0].replace(/^\s+|\s+$/g, ''); // IE friendly trim()
			
			m_data_map[key] = new Array( line[1], line[2], line[3], line[4]);			
		});
	}());
		
	//
	//PUBLIC
	//	
		
	cc.state_onchange = function(el) {
		m_state = $(el).val();		
	}
	
	cc.house_size_change = function(el) {
		m_household_size = $(el).val();
	}
	
	cc.debtor_inc_change = function(el) {
		var val = $(el).val();
		m_debtor_inc = (+val < 1) ? 0 : val;
	}
	
	cc.jointdebtor_inc_change = function(el) {
		var val = $(el).val();
		m_joint_inc = (+val < 1) ? 0 : val;
	}
	
	cc.do_compare = function() {
		// Leave if they didn't select a state and warn them.
		var state_sel = $('.' + m_state_select_class + '').val();	
		if (state_sel.length < 1) {
			alert ("Please select a state");
			return;
		}
		m_state = state_sel;
		
		// Leave if they didn't enter a household size.
		var hsize = $('#' + m_housesize_input_id + '').val();
		if (hsize < 1) {
			alert("Please enter a household size");
			return;
		}
		m_household_size = hsize;
		
		// Leave if they didn't at least enter in a value for 
		// debtor or joint debtor.		
		var val_db = $('#' + m_debtor_inc_id + '').val();
		var val_jdb = $('#' + m_joint_inc_id + '').val();

		/* if (val_db < 0 && val_jdb < 0) {
			alert("Please enter in Debtor(s) income");
			return;
		} */
		
		if (val_db.length > 0) {
			m_debtor_inc = val_db;
		}
		if (val_jdb.length > 0) {
			m_joint_inc = val_jdb;
		}
				
		// Set the "state" median income label.
		$('#' + m_lbl_state_median_inc_id + '').html(m_state + " Median Income");
		
		// Set the household size.
		$('#' + m_house_size_id + '').html(m_household_size + " People");		
				
		// Get the index of the income amount to get.  1 - 4 are the 
		// only choices.  Any amount over 4 is 4.
		var index = (m_household_size > 4) ? 4 : m_household_size;
							
		// Get the state median income amount from the array saved for the state.
		var med_inc = m_data_map[m_state][index - 1]; // One less for zero based array.
		//alert("med_inc: " + med_inc);
		
		// Add the multiplier for all house sizes over 4.
		if (m_household_size > 4) {
			var people = (+m_household_size - 4);
			var extra = (+people * m_over_four_multiplier); // Num people over 4 * $8100
			med_inc = (+med_inc + +extra);
		}
		
		// Set the State median income total.
		$('#' + m_state_med_inc_val_id + '').html("$" + med_inc);
		
		// Calculate the Debtor(s) Gross yearly income (pre-tax).
		// Equation is: 
		//	(db 6mo inc avg * 12) + (jdb 6mo inc avg * 12)
		var gyi = 0;
		if (m_debtor_inc.length > 0) {
			gyi += (+m_debtor_inc * 12);
		}
		if (m_joint_inc.length > 0) {
			gyi += (+m_joint_inc * 12);
		}
		
		// Set the Gross Yearly Income.
		$('#' + m_gross_yearly_inc_id + '').html("$" + gyi.toFixed(0));
		
		var result = +med_inc - +gyi;
		
		// Set the color of the cmi_result and its label.
		if (result > 0) {
			$('#' + m_cmi_result_id + '').css('color', 'green');
			$('#' + m_lbl_cmi_result_id + '').css('color', 'green');
			$('#' + m_lbl_cmi_result_id + '').html("Under Median");
		} else {
			$('#' + m_cmi_result_id + '').css('color', 'red');
			$('#' + m_lbl_cmi_result_id + '').css('color', 'red');
			$('#' + m_lbl_cmi_result_id + '').html("Over Median");
		}
		
		// Set the result.
		$('#' + m_cmi_result_id + '').html("$" + result.toFixed(0));
		
		// Make sure the Results section is expanded.
		$('#' + m_results_accordion_id + '').collapse("show");
	}
	
	cc.reset = function() {
		// Clear the State select.
		$('.' + m_state_select_class + '').val('');
		// Clear the Household size.
		$('#' + m_house_size_id + '').html("People");
		$('#' + m_housesize_input_id + '').val('');
		// Clear the Debtor income.
		$('#' + m_debtor_inc_id + '').val('');
		// Clear the Joint Debtor income.
		$('#' + m_joint_inc_id + '').val('');
		// Reset the State Median income.
		$('#' + m_lbl_state_median_inc_id + '').html("Median Income");
		$('#' + m_state_med_inc_val_id + '').html("$0");
		// Reset the Debtor Gross income.
		$('#' + m_gross_yearly_inc_id + '').html("$0");
		// Reset the CMI Result.			
		$('#' + m_cmi_result_id + '').css('color', 'green');
		$('#' + m_lbl_cmi_result_id + '').css('color', 'green');
		$('#' + m_lbl_cmi_result_id + '').html("Under Median");
		$('#' + m_cmi_result_id + '').html("$0");
		// Hide the Result and Instructions.
		$('#' + m_results_accordion_id + '').collapse("hide");
		$('#' + m_instrux_accordion_id + '').collapse("hide");
	}
	
	return cc;
}());