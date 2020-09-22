$(document).ready(function() {
 
/* jquery.validate plagin added using cdn. Go to jqueryvalidation.org to see what methods are provided */
/* Create custom validation method */
jQuery.validator.addMethod("multiemail", function (value, element) {
    if (this.optional(element)) {
        return true;
    }

    var emails = value.split(','),
        valid = true;

    for (var i = 0, limit = emails.length; i < limit; i++) {
        value = emails[i];
        valid = valid && jQuery.validator.methods.email.call(this, value, element);
    }
    return valid;
}, "Invalid email format: please use a comma to separate multiple email addresses.");

$("#clinicProfile").validate({
	rules: {
        clinic_phone: {
            required: true,
            phoneUS: true
        },
        clinic_email: {
            required: true,
            multiemail: true
        }
	},
// Custom message for error
	messages: {
		clinic_email: {
            required: "Empty field. Clinic email field is required.",
        },
        clinic_phone: {
            required: "Empty field. Clinic phone field is required.",
            phoneUS: "Please enter a valid US number."
		}
	},
	highlight: function(element, errorClass) {
		$(element).closest(".form-group").addClass("has-error");
	},
	unhighlight: function(element, errorClass) {
		$(element).closest(".form-group").removeClass("has-error");
	},
	errorPlacement: function (error, element) {
		error.appendTo(element.parent().next());
	},
});

$('#modalEdit').on('hidden.bs.modal', function () { 
    location.reload();
});
    
});
