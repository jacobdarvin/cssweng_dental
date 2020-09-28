$(document).ready(function() {
 
    $("#request").validate({
        rules: {
            subject: {
                required: true,
            },
            body: {
                required: true,
            }
        },
    // Custom message for error
        messages: {
            subject: {
                required: "Empty field. Subject field is required.",
            },
            body: {
                required: "Empty field. Body field is required.",
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
    
    $('#hireModal').on('hidden.bs.modal', function () { 
        location.reload();
    });

    $("#decline").validate({
        rules: {
            body: {
                required: true,
            }
        },
    // Custom message for error
        messages: {
            body: {
                required: "Empty field. Body field is required.",
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
    
    $('#declineModal').on('hidden.bs.modal', function () { 
        location.reload();
    });
        
});
    