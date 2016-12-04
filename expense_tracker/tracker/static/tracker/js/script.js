function generate_action_buttons(all_users, id, csrf) {
	if (all_users == 'true'){
		return ""
	}
	else{
		return "<div class=\"col-md-2\">\
	                <button type=\"button\" class=\"btn btn-default btn-sm\">\
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
	                <div class=\"col-md-5\">\
		                <p style=\"font-weight: bold\">" + exp['description'] + "</p>\
	                    <p style=\"font-weight: bold\">Amount: $" + exp['amount'] + "</p>\
	                </div>\
	                <div class=\"col-md-4\">" + exp['date_time'] + display_owner(all_users, exp['owner'][0] + ' ' + exp['owner'][1]) + "</div>\
                	" + generate_action_buttons(all_users, exp['id'], csrf) + "\
		            </div>\
		            <hr id=\"expense" + exp['id'] + "hr\">"

		            all_expenese_html += single_expense_html
				}


				$('#expenses_div').append(all_expenese_html);
			}
			else{
				console.log(data['status']);
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
				sucess_date = data['readable_date'].replace('PM', 'p.m.').replace('AM', 'a.m.');
				$('#new_expense_modal').modal('hide');
				$('#newExpenseForm')[0].reset();

				var new_expense_html = "<div id=\"expense" + data['new_id'] + "\" class=\"row\">\
	                <div class=\"col-md-5\">\
		                <p style=\"font-weight: bold\">" + expense_description + "</p>\
	                    <p style=\"font-weight: bold\">Amount: $" + expense_amount + "</p>\
	                </div>\
	                <div class=\"col-md-4\">" + sucess_date + "</div>\
                	<div class=\"col-md-2\">\
	                <button type=\"button\" class=\"btn btn-default btn-sm\">\
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
				console.log(data['message']);
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

				// data = data.replace("success", "").replace('PM', 'p.m.').replace('AM', 'a.m.');
				// $('#new_expense_modal').modal('hide');
				// $('#newExpenseForm')[0].reset();

				// var new_expense_html = "<div class=\"row\">\
	   //              <div class=\"col-md-5\">\
		  //               <p style=\"font-weight: bold\">" + expense_description + "</p>\
	   //                  <p style=\"font-weight: bold\">Amount: $" + expense_amount + "</p>\
	   //              </div>\
	   //              <div class=\"col-md-4\">" + data + "</div>\
	   //          </div>\
	   //          <hr>"

	   //          if ($('#expenses_div').children().size() == 0){
	   //          	$( "#no_expense_div" ).remove();
	   //          }

				// $('#expenses_div').append( new_expense_html );


			}
			else{
				console.log(data['message']);
			}

		});

	return false;

}