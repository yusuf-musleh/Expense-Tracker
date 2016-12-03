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
				console.log(data[1]);
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
				console.log(data);
			}

		});

	return false;

}