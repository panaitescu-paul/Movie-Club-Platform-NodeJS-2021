/**
* Ajax calls that consume the RESTFUL API
* JavaScript DOM Manipulation
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
            showAllMovies('guest');
        } else if (page === "crews.html") {
            console.log("PAGE crews");
            showAllCrews();
            fetch("../src/header.html")
                .then(response => {
                    return response.text()
                })
                .then(data => {
                    document.querySelector(".headerContent").innerHTML = data;
                });

            fetch("../src/footer.html")
                .then(response => {
                    return response.text()
                })
                .then(data => {
                    document.querySelector(".footerContent").innerHTML = data;
                });        } else if (page === "admins.html") {
            console.log("PAGE admins");
            showAllMovies('admin');
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
    // ***                MOVIES Functionality            ***
    // ***                                                ***
    // ******************************************************

    // Open Modal - Show Movie 
    $(document).on("click", ".showMovieModal", function() {
        const id = $(this).attr("data-id");
        clearModalData();
        showMovieDetails(id);
        showMovieRatingAverage(id);
        showMovieReviews(id);
        showMovieCrews(id);
        showMovieGenres(id);
        showMovieLanguages(id); 
    });

    // Open Modal - Create Movie 
    $(document).on("click", ".createMovieModal", function() {
        const id = $(this).attr("data-id");
        // ...
    });
    
    // Open Modal - Update Movie 
    $(document).on("click", ".updateMovieModal", function() {
        const id = $(this).attr("data-id");
        // ...
    });

    // Delete Movie
    $(document).on("click", ".deleteMovie", function(e) {
        const id = $(this).attr("data-id");
        console.log("id", id);

        if (confirm("Are you sure that you want to delete this Movie?")) {
            if (id !== null) {
                $.ajax({
                    url: URL + `movie/${id}`,
                    type: "DELETE",
                    success: function(data) {
                        // Show the updated List of Movies
                        showAllMovies('admin');
                        // Scroll to the deleted Movie
                        scrollPage(e.pageY);
                        alert('Movie was successfully deleted!');
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMsg = JSON.parse(data.responseText).Error;
                            alert(errorMsg);
                        },
                        409: function(data) {
                            const errorMsg = JSON.parse(data.responseText).Error;
                            alert(errorMsg);
                        }
                    }
                });
            }
        }
    });

    // Show all Movies in a List
    function showAllMovies(user = 'guest') {
        $.ajax({
            url: URL + "movie",
            type: "GET",
            success: function(movies) {
                console.log('movies: ', movies);
                displayMovies(movies, user);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    }

    function displayMovies(movies, user = 'guest') {
        $("section#movieResults").empty();
        if (movies.length === 0) {
            $("section#movieResults").html("There are no Movies matching the entered text.");
        } else {
            movies.forEach(element => {
                // TODO: Simplify
                if (user == 'guest') {
                    $("#results").append(`
                        <div class="card" data-id="${element.id}">
                            <img class="card-img-top" src="${element.overview}" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Release date: ${formatDate(element.releaseDate)}</li>
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
                } else if (user == 'member') {
 
                } else if (user == 'admin') {
                    $("#results").append(`
                        <div class="card" data-id="${element.id}">
                            <img class="card-img-top" src="${element.overview}" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Release date: ${formatDate(element.releaseDate)}</li>
                            </ul>
                            <div class="card-body">
                                <div class="table-actions">
                                </div>
                                <button data-id="${element.id}" type="button" class="btn btn-warning
                                        btnShow showMovieModal" data-toggle="modal" data-target="#modal">Details</button>
                                <button data-trailer="${element.trailerLink}" type="button" class="btn btn-warning
                                        btnShow showMovieModal" data-toggle="modal" data-target="#modal">Trailer Link</button>
                                <button data-id="${element.id}" type="button" class="btn btn-warning
                                    btnShow updateMovieModal" data-toggle="modal" data-target="#modal">Update</button>
                                <button data-id="${element.id}" type="button" class="btn btn-danger
                                    btnShow deleteMovie">Delete</button>
                            </div>
                        </div>
                    `);
                }
            });
        }
    }

    // Show Movie Details
    function showMovieDetails(id) {
        $.ajax({
            url: URL + `movie/${id}`,
            type: "GET",
            success: function(data) {
                console.log('data: ', data);
                $("#modalInfoContent1").append(`
                    <h3>Overview</h3>
                `);
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
                    $("#modalInfoContent1").append(`
                        <hr>
                        <p><i>No Movie Details are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });
    };

    // Show Movie Rating Average
    function showMovieRatingAverage(id) {
        $.ajax({
            url: URL + `rating/movie/${id}`,
            type: "GET",
            success: function(data) {
                const elem = $("<div />");
                elem.append($("<div />", { "class": "", "html": 
                    `<hr>
                    <h3>Ratings</h3>
                    <p>
                        <span class="tag">Rating Average</span>
                        <span class="tag-info">${calculateRatingAverage(data)}</span>
                    </p>
                `}))
                $("#modalInfoContent2").append(elem);
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent2").append(`
                        <hr>
                        <p><i>No Ratings are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });
    };

    // Show Movie Reviews
    function showMovieReviews(id) {
        $.ajax({
            url: URL + `review/movie/${id}`,
            type: "GET",
            success: function(data) {
                $("#modalInfoContent3").append(`
                    <hr>
                    <h3>Reviews</h3>
                `);
                data.forEach(element => {
                    const elem = $("<div />");
                    elem.append($("<div />", { "class": "", "html": 
                        `
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
                    $.ajax({
                        url: URL + `user/${userId}`,
                        type: "GET",
                        success: function(data) {
                            document.getElementById("user-name").innerHTML = data.firstName + ' ' + data.lastName;
                            $("#modalInfoContent3").append(elem);
                        },
                        statusCode: {
                            404: function(data) {
                                const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                    $("#modalInfoContent3").append(elem);
                });                
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent3").append(`
                        <hr>
                        <p><i>No Reviews are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });
    };

    // Show Movie Crews
    function showMovieCrews(id) {
        // GET movie_crews
        $.ajax({
            url: URL + `movie_crew/movieId/${id}`,
            type: "GET",
            success: function(movie_crew_array) {
                $("#modalInfoContent4").append(`
                    <hr>
                    <h3>Crews</h3>
                `);
                movie_crew_array.forEach(movie_crew => {
                    // GET crew
                    $.ajax({
                        url: URL + `crew/${movie_crew.crewId}`,
                        type: "GET",
                        success: function(crew) {
                            // GET role
                            $.ajax({
                                url: URL + `role/${movie_crew.roleId}`,
                                type: "GET",
                                success: function(role) {
                                    $("#modalInfoContent4").append(`
                                        <p>
                                            <span class="tag">${role.name}</span>
                                            <span class="tag-info">${crew.name}</span>
                                        </p>
                                    `);
                                },
                                statusCode: {
                                    404: function(data) {
                                        const errorMsg = JSON.parse(data.responseText).Error;
                                        // alert(errorMsg);
                                    }
                                }
                            });
                        },
                        statusCode: {
                            404: function(data) {
                                const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                });                
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent4").append(`
                        <hr>
                        <p><i>No Crews are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });
    };

    // Show Movie Genres
    function showMovieGenres(id) {
        // GET movie_genres
        $.ajax({
            url: URL + `movie_genre/movieId/${id}`,
            type: "GET",
            success: function(movie_genre_array) {
                $("#modalInfoContent5").append(`
                    <hr>
                    <h3>Genres</h3>
                    <p class="movie-genres">
                        <span class="tag">Genres: </span>
                    </p>
                `);

                movie_genre_array.forEach(movie_genre => {
                    // GET genre
                    $.ajax({
                        url: URL + `genre/${movie_genre.genreId}`,
                        type: "GET",
                        success: function(genre) {
                            console.log('genre ', genre);
                            $(".movie-genres").append(`
                                <span class="tag-info">${genre.name}, </span>
                            `);
                        },
                        statusCode: {
                            404: function(data) {
                                const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                });                
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent5").append(`
                        <hr>
                        <p><i>No Genres are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // // alert(errorMsg);
                }
            }
        });
    };

    // Show Movie Languages
    function showMovieLanguages(id) {
        // GET movie_languages
        $.ajax({
            url: URL + `movie_language/movieId/${id}`,
            type: "GET",
            success: function(movie_language_array) {
                $("#modalInfoContent6").append(`
                    <hr>
                    <h3>Languages</h3>
                    <p class="movie-languages">
                        <span class="tag">Languages: </span>
                    </p>
                `);

                movie_language_array.forEach(movie_language => {
                    // GET language
                    $.ajax({
                        url: URL + `language/${movie_language.languageId}`,
                        type: "GET",
                        success: function(language) {
                            console.log('language ', language);
                            $(".movie-languages").append(`
                                <span class="tag-info">${language.name}, </span>
                            `);
                        },
                        statusCode: {
                            404: function(data) {
                                // const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                });                
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent6").append(`
                        <hr>
                        <p><i>No Languages are available for this Movie!</i></p>
                    `);
                    // const errorMsg = JSON.parse(data.responseText).Error;
                    // alert(errorMsg);
                }
            }
        });
    };

    // ******************************************************
    // ***                                                ***
    // ***                 User Functionality             ***
    // ***                                                ***
    // ******************************************************



    // ******************************************************
    // ***                                                ***
    // ***                Scrolling Functionality         ***
    // ***                                                ***
    // ******************************************************

    // Scroll Up
    $(document).on("click", ".scrollUp", function(e) {
        e.preventDefault();
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    // Scroll Down
    $(document).on("click", ".scrollDown", function(e) {
        e.preventDefault();
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Scroll to page position
    function scrollPage(position) {
        if (position == "bottomPage") {
            setTimeout(function (){
                window.scrollTo(0, document.body.scrollHeight);
            }, 700); // Delay in milliseconds
        } else {
            document.body.scrollTop = position - 100; // For Safari
            document.documentElement.scrollTop = position; // For Chrome, Firefox, IE and Opera
        }
    }

});


// // Show Movies Page
// $(document).on("click", "#showMoviesPage", function(e) {
//     window.location.href='../src/movies.html';
// });
