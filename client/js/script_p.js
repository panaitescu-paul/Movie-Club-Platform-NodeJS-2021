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
                        // console.log(data[0]);
                        

                        // for (const element of data) {
                        //     console.log(element);

                        //     // const row = $("<tr />");
                        //     // const movies = element["ArtistId"];
                        //     // row.
                        //     //     append($("<td />", { "text": element["ArtistId"]})).
                        //     //     append($("<td />", { "text": element["Name"]}))
                        //     // tableBody.append(row);
                        // }


                        data.forEach(element => {
                            console.log(element.title);
                            $("#showList").append(`
                                <div>
                                    <p id="title">${element.title}</p>
                                    <p id="overview">${element.overview}</p>
                                    <p id="releaseDate">${element.releaseDate}</p>
                                    <p id="profile">${element.profile}</p>
                                </div>
                            `);
                        });
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