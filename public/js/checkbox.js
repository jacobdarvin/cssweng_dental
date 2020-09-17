            
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

            $(function(){
                var test = localStorage.permanent === 'true'? true: false;
                $('#permanent').prop('checked', test || false);
            });

            $('#permanent').on('change', function() {
                localStorage.permanent = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });

            $(function(){
                var test = localStorage.temporary === 'true'? true: false;
                $('#temporary').prop('checked', test || false);
            });

            $('#temporary').on('change', function() {
                localStorage.temporary = $(this).is(':checked');
                console.log($(this).is(':checked'));
            });

            $('#paginator').on('change', function (param) {
        let url = $(this).val(); // get selected value
        if (url) { // require a URL
            window.location = url; // redirect
        }
        return false;
      });

    document.getElementById("date_start").value = getSavedValue("date_start");    // set the value to this input
    document.getElementById("date_end").value = getSavedValue("date_end");   // set the value to this input
        /* Here you can add more inputs to set value. if it's saved */

        //Save the value function - save it to localStorage as (ID, VALUE)
    function saveValue(e){
        var id = e.id;  // get the sender's id to save it . 
        var val = e.value; // get the value. 
        localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
    }

        //get the saved value function - return the value of "v" from localStorage. 
    function getSavedValue  (v){
            if (!localStorage.getItem(v)) {
                return "";// You can change this to your defualt value. 
            }
            return localStorage.getItem(v);
        }