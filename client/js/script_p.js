/**
* Ajax calls that consume the RESTFUL API
*
* @author  Paul Panaitescu
* @version 1.0 28 APR 2021
*/
"use strict";

$(document).ready(function() {
    // Local version
    URL = "http://localhost:4000/";

    pageContent();

    // ******************************************************
    // ***                                                ***
    // ***   Page identification + Content assignment     ***
    // ***                                                ***
    // ******************************************************

    // Page identification
    function pageContent() {
        // Get the current page 
        // Get the last part of the URL after the shash (/)
        let str = window.location.href;
        str = str.split("/"); 
        console.log("str: ", str);

        let page = str[str.length - 1]; 
        console.log("page: ", page);

        if (page === "index.php") {
            console.log("PAGE index");
        } else if (page === "movies.html") {
            console.log("PAGE movies");
            // ShowAllMovies();
        } else if (page === "crews.html") {
            console.log("PAGE crews");
            // ShowAllCrews();
        } else if (page === "admins.html") {
            console.log("PAGE admins");
            // ShowAllAdmins();
        } else if (page === "users.html") {
            console.log("PAGE users");
            // ShowAllUsers();
        } else if (page === "community.html") {
            console.log("PAGE comunity");
            // ShowCommunity();
        } else {
            console.log("PAGE is NOT available");
        }
    }

    // $(document).ready(function() {
    //     const URLPath = 'http://localhost:8000';

    //     $('input[type=radio]').click(function() {
    //         let searchType = $('input[name="searchType"]:checked').val();
    //         switch (searchType) {
    //             case 'moviesSearch':
    //                 $.ajax({
    //                     url: `${URLPath}/movie`,
    //                     type: "GET",
    //                     success: function(data) {
    //                         console.log(data);
    //                         // console.log(data[0]);
                            

    //                         // for (const element of data) {
    //                         //     console.log(element);

    //                         //     // const row = $("<tr />");
    //                         //     // const movies = element["ArtistId"];
    //                         //     // row.
    //                         //     //     append($("<td />", { "text": element["ArtistId"]})).
    //                         //     //     append($("<td />", { "text": element["Name"]}))
    //                         //     // tableBody.append(row);
    //                         // }


    //                         data.forEach(element => {
    //                             console.log(element.title);
    //                             $("#showList").append(`
    //                                 <div>
    //                                     <p id="title">${element.title}</p>
    //                                     <p id="overview">${element.overview}</p>
    //                                     <p id="releaseDate">${element.releaseDate}</p>
    //                                     <p id="profile">${element.profile}</p>
    //                                 </div>
    //                             `);
    //                         });
    //                     }
    //                 });
    //                 break;
    //             case 'crewsSearch':
    //                 $.ajax({
    //                     url: `${URLPath}/crew`,
    //                     type: "GET",
    //                     success: function(data) {
    //                         console.log(data);
    //                     }
    //                 });
    //                 break;
    //         }
    //     });
    // });

});


// // Show Movies Page
// $(document).on("click", "#showMoviesPage", function(e) {
//     window.location.href='../src/movies.html';
// });
