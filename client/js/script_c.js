$(document).ready(function() {
    const URLPath = 'http://localhost:8000';

    $('input[type=radio]').click(function() {
        let searchType = $('input[name="searchType"]:checked').val();
        switch (searchType) {
            case 'moviesSearch':
                $.ajax({
                    url: `${URLPath}/movie`,
                    type: "GET",
                    success: function(data) {
                        console.log(data);
                    }
                });
                break;
            case 'crewsSearch':
                $.ajax({
                    url: `${URLPath}/crew`,
                    type: "GET",
                    success: function(data) {
                        console.log(data);
                    }
                });
                break;
        }
    });

});