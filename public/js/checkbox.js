            
            $(function(){
                var test = localStorage.dentist === 'true'? true: false;
                $('#dentist').prop('checked', test || false);
            });

            $('#dentist').on('change', function() {
                localStorage.dentist = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });



            $(function(){
                var test = localStorage.dentass === 'true'? true: false;
                $('#dentass').prop('checked', test || false);
            });

            $('#dentass').on('change', function() {
                localStorage.dentass = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });



            $(function(){
                var test = localStorage.denthyg === 'true'? true: false;
                $('#denthyg').prop('checked', test || false);
            });

            $('#denthyg').on('change', function() {
                localStorage.denthyg = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });



            $(function(){
                var test = localStorage.frontdesk === 'true'? true: false;
                $('#frontdesk').prop('checked', test || false);
            });

            $('#frontdesk').on('change', function() {
                localStorage.frontdesk = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });