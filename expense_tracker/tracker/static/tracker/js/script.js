function generate_action_buttons(all_users, id, csrf) {
	if (all_users == 'true'){
		return ""
	}
	else{
		return "<div id=\"action_buttons_div\" class=\"col-md-2\">\
	                <button type=\"button\" onclick=\"update_expense('/update_expense/', 'expense" + id + "', '" + csrf + "')\" class=\"btn btn-default btn-sm\">\
	  				<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> Update\
					</button>\
	                <button type=\"button\" onclick=\"delete_expense('/delete_expense/', 'expense" + id + "', '" + csrf + "')\" class=\"btn btn-danger btn-sm\">\
	  				<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Delete\
					</button>\
				</div>"
	}
}


function display_owner(all_users, owner){
	if (all_users == 'false'){
		return ""
	}
	return "<p style=\"font-weight: bold\">" + owner + "</p>"
}


function get_expenses(url, all_users, user, csrf) {
	$('#expense_report').html("");
	$.post(url,
		{
			csrfmiddlewaretoken: csrf,
			all_users: all_users
		},
		function(data) {
			data = JSON.parse(data);
			if (data['status'] == 'success'){
				$('#add_expense_div').empty();
				$('.navbar-default .navbar-nav > li > a').css('color', '#B4B4B4');
				if (all_users == 'true'){
					$('#all_user_expenses_a').css('color', 'white');
					$('#expenses_div').empty();
					$('#no_expense_div').empty();
					$('#managing_page_header').html("<h1 class=\"page-header\">Everyone's\
	                    <small>Expenses</small>\
	                 	</h1>");
				}
				else{
					$('#my_expenses_a').css('color', 'white');
					$('#expenses_div').html("<a class=\"btn btn-default\" href=\"#\" id='new_expense_btn' data-toggle=\"modal\" data-target=\"#new_expense_modal\">New Expense <span class=\"glyphicon glyphicon-plus\"></span></a><hr>");
					$('#managing_page_header').html("<h1 class=\"page-header\">" + user + "'s\
	                    <small>Expenses</small>\
	                	</h1>");
				}

				var all_expenese_html = ""

	            for (var i = 0; i < data['expenses'].length; i++) {
						var exp = data['expenses'][i]
						single_expense_html = "<div id=\"expense" + exp['id'] + "\" class=\"row\">\
	                <div id=\"desc_and_amount\" class=\"col-md-5\">\
		                <p style=\"font-weight: bold\">" + exp['description'] + "</p>\
	                    <p style=\"font-weight: bold\">Amount: $" + exp['amount'] + "</p>\
	                </div>\
	                <div id=\"date_and_time\" class=\"col-md-4\">" + exp['date_time'] + display_owner(all_users, exp['owner'][0] + ' ' + exp['owner'][1]) + "</div>\
                	" + generate_action_buttons(all_users, exp['id'], csrf) + "\
		            </div>\
		            <hr id=\"expense" + exp['id'] + "hr\">"

		            all_expenese_html += single_expense_html
				}


				$('#expenses_div').append(all_expenese_html);
			}
			else{
				alert(data['message']);
			}

		});

	return false;
}


function submit_new_expense_form(url, csrf) {

	var expense_description = $('#expense_description').val().trim();
	var expense_amount = $('#expense_amount').val().trim();
	var expense_date_time = $('#expense_date_time').val().trim();

	$.post(url,
		{
			csrfmiddlewaretoken: csrf,
			expense_description: expense_description,
			expense_amount: expense_amount,
			expense_date_time: expense_date_time

		},
		function(data) {
			data = JSON.parse(data);
			if (data['status'] == 'success'){
				sucess_date = data['readable_date'];
				$('#new_expense_modal').modal('hide');
				$('#newExpenseForm')[0].reset();

				var new_expense_html = "<div id=\"expense" + data['new_id'] + "\" class=\"row\">\
	                <div id=\"desc_and_amount\" class=\"col-md-5\">\
		                <p style=\"font-weight: bold\">" + expense_description + "</p>\
	                    <p style=\"font-weight: bold\">Amount: $" + expense_amount + "</p>\
	                </div>\
	                <div id=\"date_and_time\" class=\"col-md-4\">" + sucess_date + "</div>\
                	<div id=\"action_buttons_div\" class=\"col-md-2\">\
	                <button type=\"button\" onclick=\"update_expense('/update_expense/', 'expense" + data['new_id'] + "', '" + csrf + "')\"\" class=\"btn btn-default btn-sm\">\
	  				<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> Update\
					</button>\
	                <button type=\"button\" onclick=\"delete_expense('/delete_expense/', 'expense" + data['new_id'] + "', '" + csrf + "')\" class=\"btn btn-danger btn-sm\">\
	  				<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Delete\
					</button>\
				</div>\
	            </div>\
	            <hr id=\"expense" + data['new_id'] + "hr\">"

	            if ($('#expenses_div').children().size() == 0){
	            	$( "#no_expense_div" ).remove();
	            }

				$('#expenses_div').append( new_expense_html );


			}
			else{
				alert(data['message']);
			}

		});

	return false;
}


function delete_expense(url, expense_div_id, csrf) {
	expense_id = expense_div_id.replace('expense', '');

	$.post(url,
		{
			csrfmiddlewaretoken: csrf,
			expense_id: expense_id

		},
		function(data) {
			if (data == "success"){
				$("#" + expense_div_id).remove();
				$("#" + expense_div_id + 'hr').remove();

			}
			else{
				alert(data);
			}

		});

	return false;

}


function update_expense(url, expense_div_id, csrf) {

	var current_expense_data = $('#' + expense_div_id).html();

	// Changing update button to save button
	action_buttons = $('#' + expense_div_id).find('#action_buttons_div').html();
	action_buttons = action_buttons.replace('"update_expense(', '"save_updated_expense(').replace('glyphicon-pencil', 'glyphicon-floppy-disk').replace(' Update', ' Save');
	$('#' + expense_div_id).find('#action_buttons_div').html(action_buttons);


	// Adding expense description and amount fields in order to update values
	current_desc = $('#' + expense_div_id).find('#desc_and_amount p:eq(0)').text();
	current_amount = $('#' + expense_div_id).find('#desc_and_amount p:eq(1)').text().replace('Amount: $', '');

	var editable_desc_and_amount = "<p style=\"font-weight: bold\"><input class=\"form-control\" type=\"text\" name=\"description\" value=\"" + current_desc + "\" required></p>\
					<p style=\"font-weight: bold\"><input class=\"form-control\" type=\"number\" step=\"0.01\" min=\"0\" value=\"" + current_amount + "\" required></p>"

	$('#' + expense_div_id).find('#desc_and_amount').html(editable_desc_and_amount);

	// Adding expense date field in order to update date
	current_datetime = new Date($('#' + expense_div_id).find('#date_and_time').text());
	current_datetime = $.format.date(current_datetime, "yyyy/MM/dd HH:mm");

	$('#' + expense_div_id).find('#date_and_time').html("<input class=\"form-control\" id=\"expense_date_time\" type=\"text\" name=\"date\" value=\"" + current_datetime + "\">\
						<script type=\"text/javascript\">\
							$(function(){\
								$('*[name=date]').appendDtpicker({\
									\"minuteInterval\": 5\
								});\
							});\
						</script>");

}


function save_updated_expense(url, expense_div_id, csrf) {

	var expense_id = expense_div_id.replace('expense', '');

	var updated_expense_description = $('#' + expense_div_id + ' input:eq(0)') .val().trim();
	var updated_expense_amount = $('#' + expense_div_id + ' input:eq(1)') .val().trim();
	var updated_date_time = $('#' + expense_div_id).find('#date_and_time input:eq(0)') .val().trim();

	$.post(url,
		{
			csrfmiddlewaretoken: csrf,
			expense_id: expense_id,
			updated_expense_description: updated_expense_description,
			updated_expense_amount: updated_expense_amount,
			updated_date_time: updated_date_time

		},
		function(data) {
			data = JSON.parse(data);
			if (data['status'] == 'success'){

				// Changing the actions buttons back to 'update' and 'delete'
				action_buttons = $('#' + expense_div_id).find('#action_buttons_div').html();
				action_buttons = action_buttons.replace('"save_updated_expense(', '"update_expense(').replace('glyphicon-floppy-disk', 'glyphicon-pencil').replace(' Save', ' Update');
				$('#' + expense_div_id).find('#action_buttons_div').html(action_buttons);


				// Setting the values of the fields to the updated ones, and removing editablility
				var updated_desc_and_amount = "<p style=\"font-weight: bold\">" + data['updated_expense']['description'] + "</p>\
                    <p style=\"font-weight: bold\">Amount: $" + data['updated_expense']['amount'] + "</p>";

               	$('#' + expense_div_id).find('#desc_and_amount').html(updated_desc_and_amount);

               	// Setting the value of the date and time field, removing pick new date/time
				$('#' + expense_div_id).find('#date_and_time').html(data['updated_expense']['date_time']);

			}
			else{
				alert(data['message']);
			}
		});

	return false;
}


function filter_expenses(url, csrf){

	var start_date = $("#report_start_datetime").val().trim();
	var end_date = $("#report_end_datetime").val().trim();


	$.post(url,
		{
			csrfmiddlewaretoken: csrf,
			start_date: start_date,
			end_date: end_date

		},
		function(data) {
			data = JSON.parse(data);
			if (data['status'] == 'success'){
				var expenses = ""
				for (var i = 0; i < data['expenses_between'].length; i++) {
					expense = "<div id=\"expense" + data['expenses_between'][i]['id'] + "\" class=\"row\">\
						<div id=\"desc_and_amount\" class=\"col-md-5\">\
							<p style=\"font-weight: bold\">" + data['expenses_between'][i]['description'] + "</p>\
							<p style=\"font-weight: bold\">Amount: $" + data['expenses_between'][i]['amount'] + "</p>\
						</div>\
						<div id=\"date_and_time\" class=\"col-md-4\">" + data['expenses_between'][i]['date_time'] + "\
						</div>\
					</div>\
					<hr id=\"expense" + data['expenses_between'][i]['id'] + "hr\">"
					expenses += expense
				}

				$("#filtered_results").html(expenses);

			}
			else{
				alert(data['message'])
			}
		}
	);

}



function get_report(url, owner, csrf) {
	$("#expenses_div").html("");
	$("#add_expense_div").html("");
	$('.navbar-default .navbar-nav > li > a').css('color', '#B4B4B4');
	$('#report_a').css('color', 'white');
	$("#managing_page_header > h1").html(owner + "'s <small>Expense Report</small>");

	$.post(url,
		{
			csrfmiddlewaretoken: csrf,

		},
		function(data) {
			data = JSON.parse(data);
			if (data['status'] == 'success'){
				var sorted_keys = []
				$.each(data['expenses_per_week'], function(key, element) {
					sorted_keys.push(key);
				});
				sorted_keys.sort();
				var total_weekly_expenses = "<div class=\"row\">";
				for (var i = 0; i < sorted_keys.length; i++){
					var exp = "<div class=\"col-md-4\">\
		    		<p style=\"font-weight: bold\">Week: " + sorted_keys[i] + " -- " + data['expenses_per_week'][sorted_keys[i]][0] + "</p>\
		    		<p style=\"font-weight: bold\">Total Amount Spent: $" + data['expenses_per_week'][sorted_keys[i]][1] + "</p>\
	    			<hr>\
	    			</div>";
	    		total_weekly_expenses += exp;
				}

				total_weekly_expenses += "</div><br>";
				$("#expense_report").html(total_weekly_expenses);


				var filter_elements = "<p style=\"font-weight: bold\">Get Expenses between Start and End Dates:</p>\
		        	<div class=\"row\">\
			        	<div class=\"col-md-4\">\
			        		<label for=\"expense_date_time\">Start Date</label>\
							<input class=\"form-control\" id=\"report_start_datetime\" type=\"text\" name=\"date\" value=\"\">\
							<script type=\"text/javascript\">\
								$(function(){\
									$('*[name=date]').appendDtpicker({\
										\"minuteInterval\": 5\
									});\
								});\
							</script>\
						</div>\
						<div class=\"col-md-4\">\
			        		<label for=\"expense_date_time\">End Date</label>\
							<input class=\"form-control\" id=\"report_end_datetime\" type=\"text\" name=\"date\" value=\"\">\
							<script type=\"text/javascript\">\
								$(function(){\
									$('*[name=date]').appendDtpicker({\
										\"minuteInterval\": 5\
									});\
								});\
							</script>\
						</div>\
					</div>\
					<br>\
					<div class=\"row\">\
						<div class=\"col-md-4\">\
							<a class=\"btn btn-default\" href=\"#\" onclick=\"filter_expenses('/filter_expenses/', '" + csrf + "')\" id='filter_expenses_btn'>Filter Expenses<span class=\"glyphicon glyphicon-filter\"></span></a>\
						</div>\
					</div>\
					<hr>\
					<div id=\"filtered_results\">\
					</div>";


				$("#expense_report").append(filter_elements);


			}
			else{
				alert(data['message'])
			}

		});

}



