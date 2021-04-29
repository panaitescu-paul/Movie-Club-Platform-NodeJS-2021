/**
* Ajax calls that consume the RESTFUL API
*
* @author  Paul Panaitescu
* @version 1.0 28 APR 2021
*/
"use strict";

$(document).ready(function() {
    // Local version
    URL = "http://localhost:8000/";

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
            ShowAllMovies();
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

    // ******************************************************
    // ***                                                ***
    // ***                Movies Functionality            ***
    // ***                                                ***
    // ******************************************************

    // Show all Movies in a List
    function ShowAllMovies(user = 'guest') {
        $.ajax({
            url: URL + "movie",
            type: "GET",
            success: function(data) {
                console.log('data: ', data);
                if (user == 'guest') {
                    if (data.length === 0) {
                        $("section#movieResults").html("There are no Movies matching the entered text.");
                    } else {
                        data.forEach(element => {
                            if (element.releaseDate) {
                                var releaseDate = element.releaseDate.slice(0,10);
                            } else {
                                var releaseDate = 'Unknown';

                            }
                            $("#results").append(`
                                <div class="card" data-id="${element.id}">
                                    <img class="card-img-top" src="${element.overview}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.title}</h5>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">Release date: ${releaseDate}</li>
                                    </ul>
                                    <div class="card-body">
                                    <div class="table-actions">
                                    </div>
                                        <button data-id="${element.id}" type="button" class="btn btn-warning
                                                btnShow showMovieModal" data-toggle="modal" data-target="#modal">Details</button>
                                        <button data-trailer="${element.trailerLink}" type="button" class="btn btn-warning
                                                btnShow showMovieModal" data-toggle="modal" data-target="#modal">Trailer Link</button>
                                    </div>
                                </div>
                            `);
                        });
                    }
                }
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    }

    // Open Modal - Show Movie 
    $(document).on("click", ".showMovieModal", function() {
        const id = $(this).attr("data-id");
        $.ajax({
            url: URL + `movie/${id}`,
            type: "GET",
            success: function(data) {
                console.log('data: ', data);

                // Empty the previous Results
                $("#modalInfoContent1").empty();
                $("#modalInfoContent2").empty();

                const elem = $("<div />");
                $("#modalTitle").html("Movie Details");           
                elem.append($("<div />", { "class": "", "html": 
                    `<p>
                        <span class="tag">Id</span>
                        <span class="tag-info">${data.id}</span>
                    </p>
                    <p>
                        <span class="tag">Title</span>
                        <span class="tag-info">${data.title}</span>
                    </p>
                    <p>
                        <span class="tag">Overview</span>
                        <span class="tag-info">${data.overview}</span>
                    </p>
                    <p>
                        <span class="tag">Runtime</span>
                        <span class="tag-info">${data.runtime}</span>
                    </p>
                    <p>
                        <span class="tag">TrailerLink</span>
                        <span class="tag-info">${data.trailerLink}</span>
                    </p>
                    <p>
                        <span class="tag">Poster</span>
                        <span class="tag-info">${data.poster}</span>
                    </p>
                    <p>
                        <span class="tag">RelseaseDate</span>
                        <span class="tag-info">${data.relseaseDate}</span>
                    </p>
                    <p>
                        <span class="tag">Created At</span>
                        <span class="tag-info">${data.createdAt}</span>
                    </p>
                    `
                    }))
                $("#modalInfoContent1").append(elem);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });

        $.ajax({
            url: URL + `rating/movie/${id}`,
            type: "GET",
            success: function(data) {
                // Calculate the Average Rating
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    sum += data[i].value;
                }
                let average = sum/data.length;
                console.log('sum: ', sum);
                console.log('average: ', average);

                const elem = $("<div />");
                elem.append($("<div />", { "class": "", "html": 
                    `<hr>
                    <h3>Ratings</h3>
                    <p>
                        <span class="tag">Rating Average</span>
                        <span class="tag-info">${average}</span>
                    </p>
                    <hr>
                    <h3>Reviews</h3>
                    `}))
                $("#modalInfoContent2").append(elem);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });

        $.ajax({
            url: URL + `review/movie/${id}`,
            type: "GET",
            success: function(data) {
                data.forEach(element => {
                    const elem = $("<div />");
                    elem.append($("<div />", { "class": "", "html": 
                        `<hr>
                        <p>
                            <span class="tag">User name:</span>
                            <span class="tag-info" id="user-name"></span>
                        </p>
                        <p>
                            <span class="tag">Title</span>
                            <span class="tag-info">${element.title}</span>
                        </p>
                        <p>
                            <span class="tag">Content</span>
                            <span class="tag-info">${element.content}</span>
                        </p>
                        ` }))
                    let userId = element.userId;
                    console.log('userId: ', userId);

                    $.ajax({
                        url: URL + `user/${userId}`,
                        type: "GET",
                        success: function(data) {
                            document.getElementById("user-name").innerHTML = data.firstName + ' ' + data.lastName;
                            $("#modalInfoContent2").append(elem);
                        },
                        statusCode: {
                            404: function(data) {
                                const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                    $("#modalInfoContent2").append(elem);
                });                
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });

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
});


// // Show Movies Page
// $(document).on("click", "#showMoviesPage", function(e) {
//     window.location.href='../src/movies.html';
// });
