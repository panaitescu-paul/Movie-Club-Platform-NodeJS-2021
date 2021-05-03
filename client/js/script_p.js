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
            ShowAllCrews();
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

        // $.ajax({
        //     url: URL + `crew/movie/${id}`,
        //     type: "GET",
        //     success: function(data) {
        //         console.log('-------------data: ', data);
        //         data.forEach(element => {

        //             const elem = $("<div />");
        //             elem.append($("<div />", { "class": "", "html": 
        //                 `<hr>
        //                 <p>
        //                     <span class="tag">User name:</span>
        //                     <span class="tag-info" id="user-name"></span>
        //                 </p>
        //                 <p>
        //                     <span class="tag">Title</span>
        //                     <span class="tag-info">${element.title}</span>
        //                 </p>
        //                 <p>
        //                     <span class="tag">Content</span>
        //                     <span class="tag-info">${element.content}</span>
        //                 </p>
        //                 ` }))
        //             let userId = element.userId;
        //             console.log('userId: ', userId);


        //             $.ajax({
        //                 url: URL + `user/${userId}`,
        //                 type: "GET",
        //                 success: function(data) {
        //                     document.getElementById("user-name").innerHTML = data.firstName + ' ' + data.lastName;
        //                     $("#modalInfoContent2").append(elem);
        //                 },
        //                 statusCode: {
        //                     404: function(data) {
        //                         const errorMsg = JSON.parse(data.responseText).Error;
        //                         // alert(errorMsg);
        //                     }
        //                 }
        //             });
                    
        //             $("#modalInfoContent2").append(elem);
        //         });                
        //     },
        //     statusCode: {
        //         404: function(data) {
        //             const errorMsg = JSON.parse(data.responseText).Error;
        //             // alert(errorMsg);
        //         }
        //     }
        // });
    });
});


// // Show Movies Page
// $(document).on("click", "#showMoviesPage", function(e) {
//     window.location.href='../src/movies.html';
// });
