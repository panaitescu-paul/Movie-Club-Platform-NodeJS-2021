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
    const URL = "http://localhost:8000/";
    
    // Constants for Validation
    const INVALID_TEXT = /[`!@#$%^&*_+\=\[\]{};"\\|<>\?~]/;
    // const INVALID_TEXT = /[`!@#$%^&*_+\=\[\]{};"\\|<>\/?~]/;
    const INVALID_EMAIL = /[`!#$%^&*+\=\[\]{};"\\|<>\/?~]/;
    const VALID_NUMBER = /^\d+$/;
    // TODO: add valid date pattern;
    // const VALID_DATE = '';

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
            importHeaderFragment().then( () => {
                importFooterFragment();
                checkIfAdminLoggedIn();
                checkMemberLogin();
                showAllMovies('guest');
            });
        } else if (page === "crews.html") {
            console.log("PAGE crews");
            importHeaderFragment().then( () => {
                importFooterFragment();
                checkIfAdminLoggedIn();
                checkMemberLogin();
                showAllCrews('guest');
            });
        } else if (page === "admins.html" || page === "admins.html?") {
            console.log("PAGE admins");
            checkAdminLogin();
            showSearchType('None');
            showButtonCreate('None');
            submenuAdmin();
            $('#btnMoviesTab').click();
        } else if (page === "community.html") {
            console.log("PAGE community");
            importHeaderFragment().then( () => {
                importFooterFragment();
                checkIfAdminLoggedIn();
                checkMemberLogin();
                showAllRooms();
                $('.chat').hide();
            });
        } else if (page === "login.html" || page === "login.html?") {
            console.log("PAGE login");
            importHeaderFragment().then( () => {
                importFooterFragment();
                checkIfMemberLoggedIn();
                checkIfAdminLoggedIn();
                loginFormType();
            });
        } else {
            console.log("PAGE is NOT available");
        }
    }

    // ******************************************************
    // ***                                                ***
    // ***               Submenu Functionality            ***
    // ***                                                ***
    // ******************************************************

    function submenuAdmin() {
        $(document).on("click", "#btnMoviesTab", function() {
            showSearchType('Movie');
            showButtonCreate('Movie');
            showAllMovies('admin');
        });
        $(document).on("click", "#btnCrewsTab", function() {
            showSearchType('Crew');
            showButtonCreate('Crew');
            showAllCrews('admin');
        });
        $(document).on("click", "#btnAdminsTab", function() {
            showSearchType('Admin');
            showButtonCreate('Admin');
            showAllAdmins();
        });
        $(document).on("click", "#btnMembersTab", function() {
            showSearchType('Member');
            showButtonCreate('Member');
            showAllUsers('admin');
        });
    }

    // ******************************************************
    // ***                                                ***
    // ***                MOVIES Functionality            ***
    // ***                                                ***
    // ******************************************************

    // Show Movie - Open Modal
    $(document).on("click", ".showMovieModal", function() {
        const id = $(this).attr("data-id");
        clearModalData();
        showMovieDetails(id);
        showMovieRatingAverage(id);
        showMovieCrews(id);
        showMovieGenres(id);
        showMovieLanguages(id); 
        showMovieReviews(id);
    });

    // Create Movie - Open Modal
    $(document).on("click", "#btnCreateMovie", function() {
        clearModalData();
        $("#modalTitle").html("Create Movie");   
        $("#modalInfoContent1").append(`
            <form id="createMovieForm">
                <div class="form-group form-custom">
                    <label for="title">Title</label>
                    <input type="text" id="title" class="form-control" required>
                    <label for="overview">Overview</label>
                    <input type="text" id="overview" class="form-control" required>
                    <label for="runtime">Runtime</label>
                    <input type="text" id="runtime" class="form-control" required>
                    <label for="trailerLink">Trailer Link</label>
                    <input type="text" id="trailerLink" class="form-control" required>
                    <label for="poster">Poster</label>
                    <input type="text" id="poster" class="form-control" required>
                    <label for="releaseDate">Release Date</label>
                    <input type="date" id="releaseDate" class="form-control" required>
                    <div class="modal-actions">
                        <button type="submit" id="createMovie" class="btn btn-success btn-3" data-dismiss="modal">Create Movie</button>
                    </div>
                </div>
            </form>
        `);       
    });

    // Create Movie - Form Processing
    $(document).on("click", "#createMovie", function(e) {
        const title = $("#title").val(); 
        const overview = $("#overview").val(); 
        const runtime = $("#runtime").val(); 
        const trailerLink = $("#trailerLink").val(); 
        const poster = $("#poster").val(); 
        const releaseDate = $("#releaseDate").val(); 

        if (title === null || title.length === 0) {
            alert("The field Title can not be empty!");
        } else if (INVALID_TEXT.test(title)) {
            alert("The field Title can not contain invalid characters!");
        } else if (INVALID_TEXT.test(overview)) {
            alert("The field Overview can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(runtime)) {
        //     alert("The field Runtime can not contain invalid characters!");
        } else if (INVALID_TEXT.test(trailerLink)) {
            alert("The field Trailer Link can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(poster)) {
        //     alert("The field Poster can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(releaseDate)) {
        //     alert("The field Release Date can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `movie`,
                type: "POST",
                data: {
                    title: title,
                    overview: overview,
                    runtime: runtime,
                    trailerLink: trailerLink,
                    poster: poster,
                    releaseDate: releaseDate,
                },
                success: function(data) {
                    // Show the updated List of Movies
                    showAllMovies('admin');
                    // Scroll to the created Movie
                    scrollPage("bottomPage");
                    alert('Movie was successfully created!');
                },
                statusCode: {
                    400: function(data) {
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
    });
    
    // Update Movie - Open Modal
    $(document).on("click", ".updateMovieModal", function() {
        const id = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: URL + `movie/${id}`,
            type: "GET",
            success: function(data) {
                $("#modalTitle").html("Update Movie");   
                $("#modalInfoContent1").append(`
                    <form id="updateMovieForm">
                        <div class="form-group form-custom">
                            <div class="modal-image">
                                <img class="card-img-top" src="${data.poster}"> 
                            </div>
                            </br>
                            <h3 class="modal-subtitle">Overview</h3>
                            <label for="movieId">Movie Id</label>
                            <input type="text" id="movieId" class="form-control" value="${data.id}" disabled>
                            <label for="title">Title</label>
                            <input type="text" id="title" class="form-control" value="${data.title}" required>
                            <label for="overview">Overview</label>
                            <textarea id="overview" class="form-control" rows="3">${data.overview}</textarea>
                            <label for="runtime">Runtime</label>
                            <input type="text" id="runtime" class="form-control" value="${data.runtime}">
                            <label for="trailerLink">Trailer Link</label>
                            <input type="text" id="trailerLink" class="form-control" value="${data.trailerLink}">
                            <label for="releaseDate">Release Date</label>
                            <input type="date" id="releaseDate" class="form-control" value="${formatDate(data.releaseDate)}">
                            <label for="poster">Poster</label>
                            <textarea id="poster" class="form-control" rows="3">${data.poster}</textarea>
                            <label for="createdAt">Created At</label>
                            <input type="text" id="createdAt" class="form-control" value="${formatDate(data.createdAt)}" disabled>
                            <div class="modal-actions">
                                <button type="submit" id="updateMovie" class="btn btn-success btn-3" data-dismiss="modal">Update Movie</button>
                            </div>
                            </br>
                            <hr>
                            </br>
                        </div>
                    </form>
                `);

                // Show Elements
                showMovieCrews(id);
                showMovieGenres(id);
                showMovieLanguages(id); 

                $("#modalInfoContent4").append(`
                    <form id="updateMovieForm2">
                        <div class="form-group form-custom">
                            <label for="crewsDropdown">Select Crew</label>
                            <select name="crewsDropdown" id="crewsDropdown" class="form-control"></select>
                            <label for="rolesDropdown">Select Role</label>
                            <select name="rolesDropdown" id="rolesDropdown" class="form-control"></select>
                            <div class="modal-actions">
                                <button type="submit" id="updateMovieCrew" class="btn btn-success btn-3" data-dismiss="modal">Add Crew</button>
                            </div>
                            </br>
                            <hr>
                            </br>
                        </div>
                    </form>
                `);
                $("#modalInfoContent5").append(`
                    <form id="updateMovieForm3">
                        <div class="form-group form-custom">
                            <label for="genresDropdown">Select Genre</label>
                            <select name="genresDropdown" id="genresDropdown" class="form-control"></select>
                            <div class="modal-actions">
                                <button type="submit" id="updateMovieGenre" class="btn btn-success btn-3" data-dismiss="modal">Add Genre</button>
                            </div>
                            </br>
                            <hr>
                            </br>
                        </div>
                    </form>
                `);
                $("#modalInfoContent6").append(`
                    <form id="updateMovieForm4">
                        <div class="form-group form-custom">
                            <label for="languagesDropdown">Select Language</label>
                            <select name="languagesDropdown" id="languagesDropdown" class="form-control"></select>
                            <div class="modal-actions">
                                <button type="submit" id="updateMovieLanguage" class="btn btn-success btn-3" data-dismiss="modal">Add Language</button>
                            </div>
                        </div>
                    </form>
                `);

                // Populate the Dropdowns
                populateDropdownCrews();
                populateDropdownRoles();
                populateDropdownGenres();
                populateDropdownLanguages();
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent1").append(`
                        <div class="modal-box">
                            <p><i>No Movie Details are available for this Movie!</i></p>
                        </div>
                    `);
                }
            }
        });
    });

    // Populate Dropdown - Crews
    function populateDropdownCrews() {
        $.ajax({
            url: URL + "crew",
            type: "GET",
            success: function(crews) {
                crews.forEach((crew) => {
                    $('#crewsDropdown').append(`
                        <option value="${crew.id}">${crew.id}. ${crew.name}</option>
                    `);
                })
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    }

    // Populate Dropdown - Roles
    function populateDropdownRoles() {
        $.ajax({
            url: URL + "role",
            type: "GET",
            success: function(roles) {
                roles.forEach((role) => {
                    $('#rolesDropdown').append(`
                        <option value="${role.id}">${role.id}. ${role.name}</option>
                    `);
                })
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    }

    // Populate Dropdown - Genres
    function populateDropdownGenres() {
        $.ajax({
            url: URL + "genre",
            type: "GET",
            success: function(genres) {
                genres.forEach((genre) => {
                    $('#genresDropdown').append(`
                        <option value="${genre.id}">${genre.id}. ${genre.name}</option>
                    `);
                })
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    }

    // Populate Dropdown - Language
    function populateDropdownLanguages() {
        $.ajax({
            url: URL + "language",
            type: "GET",
            success: function(languages) {
                languages.forEach((language) => {
                    $('#languagesDropdown').append(`
                        <option value="${language.id}">${language.id}. ${language.name}</option>
                    `);
                })
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    }

    // Update Movie - Form Processing
    $(document).on("click", "#updateMovie", function(e) {
        const movieId = $("#movieId").val(); 
        const title = $("#title").val(); 
        const overview = $("#overview").val(); 
        const runtime = $("#runtime").val(); 
        const trailerLink = $("#trailerLink").val(); 
        const poster = $("#poster").val(); 
        const releaseDate = $("#releaseDate").val(); 

        if (title === null || title.length === 0) {
            alert("The field Title can not be empty!");
        } else if (INVALID_TEXT.test(title)) {
            alert("The field Title can not contain invalid characters!");
        } else if (INVALID_TEXT.test(overview)) {
            alert("The field Overview can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(runtime)) {
        //     alert("The field Runtime can not contain invalid characters!");
        } else if (INVALID_TEXT.test(trailerLink)) {
            alert("The field Trailer Link can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(poster)) {
        //     alert("The field Poster can not contain invalid characters!");
        // } else if (INVALID_TEXT.test(releaseDate)) {
        //     alert("The field ReleaseDate can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `movie/${movieId}`,
                type: "PUT",
                data: {
                    title: title,
                    overview: overview,
                    runtime: runtime,
                    trailerLink: trailerLink,
                    poster: poster,
                    releaseDate: releaseDate,
                },
                success: function(data) {
                    // Show the updated List of Movies
                    showAllMovies('admin');
                    // Scroll to the updated Movie
                    scrollPage(e.pageY);
                    alert('Movie was successfully updated!');
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
    });

    // Update Movie Crew - Form Processing
    $(document).on("click", "#updateMovieCrew", function(e) {
        const movieId = $("#movieId").val(); 
        const crewId = $("#crewsDropdown option:selected").val(); 
        const roleId = $("#rolesDropdown option:selected").val(); 

        $.ajax({
            url: URL + `movie_crew`,
            type: "POST",
            data: {
                movieId: movieId,
                crewId: crewId,
                roleId: roleId,
            },
            success: function(data) {
                // Show the updated List of Movies
                showAllMovies('admin');
                // Scroll to the updated Movie
                scrollPage(e.pageY);
                alert('This Crew was successfully attached to this Movie!');
            },
            statusCode: {
                400: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                409: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    });

    // Update Movie Genre - Form Processing
    $(document).on("click", "#updateMovieGenre", function(e) {
        const movieId = $("#movieId").val(); 
        const genreId = $("#genresDropdown option:selected").val(); 

        $.ajax({
            url: URL + `movie_genre`,
            type: "POST",
            data: {
                movieId: movieId,
                genreId: genreId,
            },
            success: function(data) {
                // Show the updated List of Movies
                showAllMovies('admin');
                // Scroll to the updated Movie
                scrollPage(e.pageY);
                alert('This Genre was successfully attached to this Movie!');
            },
            statusCode: {
                400: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                409: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
    });

    // Update Movie Language - Form Processing
    $(document).on("click", "#updateMovieLanguage", function(e) {
        const movieId = $("#movieId").val(); 
        const languageId = $("#languagesDropdown option:selected").val(); 

        $.ajax({
            url: URL + `movie_language`,
            type: "POST",
            data: {
                movieId: movieId,
                languageId: languageId,
            },
            success: function(data) {
                // Show the updated List of Movies
                showAllMovies('admin');
                // Scroll to the updated Movie
                scrollPage(e.pageY);
                alert('This Language was successfully attached to this Movie!');
            },
            statusCode: {
                400: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                404: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                },
                409: function(data) {
                    const errorMsg = data.responseJSON.message;
                    alert(errorMsg);
                }
            }
        });
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

    // Search Movies - Show all Movies in a List
    $("#movieSearchForm").on("submit", function(e) {
        e.preventDefault();
        const searchInput = $('#searchMovie').val();
        $.ajax({
            url: URL + `movie/title/search?title=${searchInput}`,
            type: "GET",
            success: function(movies) {
                console.log('movies: ', movies);
                if (window.location.href === 'http://localhost:4000/src/admins.html' || window.location.href === 'http://localhost:4000/src/admins.html?') {
                    displayMovies(movies, 'admin');
                } else {
                    displayMovies(movies, 'guest');
                }
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    $("#results").empty().append(`
                        <p class="alert alert-warning">${errorMessage}</p>
                    `);
                }
            }
        });
    });

    // Show Movie Trailer - Open Modal
    $(document).on("click", ".showMovieTrailerModal", function() {
        const link = $(this).attr("data-link");
        clearModalData();
        $("#modalTitle").html("Movie Trailer");    
        $("#modalInfoContent1").append(`
            <div class="video">
                <iframe src="${link}" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
            </div>
        `);
    });

    function displayMovies(movies, user = 'guest') {
        $("section#movieResults").empty();
        $("#results").empty();
        if (movies.length === 0) {
            $("section#movieResults").html("There are no Movies matching the entered text.");
        } else {
            movies.forEach(element => {
                if(element.poster === null || element.poster === '') {
                    element.poster = "../img/noImageAvailable.jpg";
                }
                if (user == 'guest') {
                    // Version 3
                    $("#results").append(`
                        <div class="card">
                            <div class="card-body showMovieModal" data-id="${element.id}" data-toggle="modal" data-target="#modal">
                                <img class="card-img-top" src="${element.poster}" alt="Card image cap">
                                <h5 class="card-title">${element.title}</h5>
                            </div>
                            <div class="card-actions">
                                <button data-link="${element.trailerLink}" type="button" class="btn btn-warning showMovieTrailerModal" 
                                        data-toggle="modal" data-target="#modal">Trailer Link</button>
                            </div>
                        </div>
                    `);
                } else if (user == 'member') {
                    // Version 3
                    $("#results").append(`
                        <div class="card">
                            <div class="card-body showMovieModal" data-id="${element.id}" data-toggle="modal" data-target="#modal">
                                <img class="card-img-top" src="${element.poster}" alt="Card image cap">
                                <h5 class="card-title">${element.title}</h5>
                            </div>
                            <div class="card-actions">
                                <button data-link="${element.trailerLink}" type="button" class="btn btn-warning showMovieTrailerModal" 
                                        data-toggle="modal" data-target="#modal">Trailer Link</button>
                            </div>
                        </div>
                    `);
                } else if (user == 'admin') {
                    $("#results").append(`
                        <div class="card">
                            <div class="card-body showMovieModal" data-id="${element.id}" data-toggle="modal" data-target="#modal">
                                <img class="card-img-top" src="${element.poster}" alt="Card image cap">
                                <h5 class="card-title">${element.title}</h5>
                            </div>
                            <div class="card-actions">
                                <button data-link="${element.trailerLink}" type="button" class="btn btn-warning showMovieTrailerModal" 
                                        data-toggle="modal" data-target="#modal">Trailer Link</button>
                                <button data-id="${element.id}" type="button" class="btn btn-success updateMovieModal" 
                                        data-toggle="modal" data-target="#modal">Update</button>
                                <button data-id="${element.id}" type="button" class="btn btn-danger deleteMovie">Delete</button>
                            </div>
                        </div>
                    `);
                }
            });
        }
    }

    // Show Movie Details - Open Modal
    function showMovieDetails(id) {
        $.ajax({
            url: URL + `movie/${id}`,
            type: "GET",
            success: function(data) {
                console.log('data: ', data);
                $("#modalTitle").html("Movie Details");  
                $("#modalInfoContent1").append(`
                    <div class="modal-image">
                        <img class="card-img-top" src="${data.poster}"> 
                    </div>
                    </br>
                    <h3 class="modal-subtitle">Overview</h3>
                    <div class="modal-box">
                        <p>
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
                            <span class="tag-info">
                                <a href="${data.trailerLink}" target="_blank">${data.trailerLink}</a>
                            </span>
                        </p>
                        <p>
                            <span class="tag">RelseaseDate</span>
                            <span class="tag-info">${formatDate(data.releaseDate)}</span>
                        </p>
                        <p>
                            <span class="tag">Created At</span>
                            <span class="tag-info">${formatDate(data.createdAt)}</span>
                        </p>
                    </div>
                `);
                // <p>
                //     <span class="tag">Poster</span>
                //     <span class="tag-info">${data.poster}</span>
                // </p>
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent1").append(`
                        <h3 class="modal-subtitle">Overview</h3>
                        <div class="modal-box">
                            <p><i>No Movie Details are available for this Movie!</i></p>
                        </div>
                    `);
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
                $("#modalInfoContent2").append(`
                    <h3 class="modal-subtitle">Ratings</h3>
                    <div data-movieid="${id}" class="modal-box">
                        <div class="loader"></div>
                        <div id="ratingContent">
                            <p id="ratingText">
                                <span class="tag">Rating Average</span>
                                <span id="ratingAverage" class="tag-info">${calculateRatingAverage(data)}</span>
                            </p>
                            <span class="tag">Your Rating</span>
                            <div class="rating">
                                <span class="rating__result"></span>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="fas fa-times-circle" id="removeRating"></i>
                            </div>
                        </div>
                    </div>
                `);
                $('.loader').hide();
                ratingStarsSelection();
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent2").append(`
                        <h3 class="modal-subtitle">Ratings</h3>
                        <div data-movieid="${id}" class="modal-box">
                            <div class="loader"></div>
                            <div id="ratingContent">
                                <p id="ratingText"><i>No Ratings are available for this Movie!</i></p>
                                <span class="tag">Your Rating</span>
                                <div class="rating">
                                    <span class="rating__result"></span>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="rating__star far fa-star"></i>
                                    <i class="fas fa-times-circle" id="removeRating"></i>
                                </div>
                            </div>
                            
                        </div>
                    `);
                    $('.loader').hide();
                    ratingStarsSelection();
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
                $("#modalInfoContent3").append(`
                    <h3 class="modal-subtitle">Crews</h3>
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
                                    $("#modalInfoContent3").append(`
                                        <div class="modal-box crewInfo" data-id="${crew.id}">
                                            <p class="crew-section">
                                                <span class="tag">${role.name}</span>
                                                <span class="tag-info">${crew.name}</span>
                                                <img class="card-img-top small-picture" src="${crew.picture}"> 
                                            </p>
                                        </div>
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
                    $("#modalInfoContent3").append(`
                        <h3 class="modal-subtitle">Crews</h3>
                        <div class="modal-box">
                            <p><i>No Crews are available for this Movie!</i></p>
                        </div>
                    `);
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
                $("#modalInfoContent4").append(`
                    <h3 class="modal-subtitle">Genres</h3>
                    <div class="modal-box">
                        <p class="movie-genres">
                            <span class="tag">Genres: </span>
                        </p>
                    </div>
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
                    $("#modalInfoContent4").append(`
                        <h3 class="modal-subtitle">Genres</h3>
                        <div class="modal-box">
                            <p><i>No Genres are available for this Movie!</i></p>
                        </div>
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
                $("#modalInfoContent5").append(`
                    <h3 class="modal-subtitle">Languages</h3>
                    <div class="modal-box">
                        <p class="movie-languages">
                            <span class="tag">Languages: </span>
                        </p>
                    </div>
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
                    $("#modalInfoContent5").append(`
                        <h3 class="modal-subtitle">Languages</h3>
                        <div class="modal-box">
                            <p><i>No Languages are available for this Movie!</i></p>
                        </div>
                    `);
                }
            }
        });
    };

    // Show Movie Reviews
    function showMovieReviews(id) {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        $.ajax({
            url: URL + `review/movie/${id}`,
            type: "GET",
            success: function(data) {
                $("#modalInfoContent6").append(`
                    <h3 class="modal-subtitle">Reviews</h3>
                `);
                data.forEach(element => {
                    $("#modalInfoContent6").append(
                        `
                        <div class="modal-box">
                            <p>
                                <span>By: </span>
                                <span class="tag" id="${element.userId}"></span>
                                <span>at: </span>
                                <span class="tag">${formatDate(element.createdAt)}</span>
                            </p>
                            <div class="modal-review-body">
                                <p>
                                    <span class="review-title">${element.title}</span>
                                </p>
                                <p>
                                    <span class="review-content">${element.content}</span>
                                </p>
                            </div>
                            <div class="card-actions">
                                <button data-id="${element.id}" data-user-id="${element.userId}" type="button" class="btn btn-success updateReview">Update</button>
                                <button data-id="${element.id}" data-user-id="${element.userId}" type="button" class="btn btn-danger deleteReview">Delete</button>
                            </div>
                            <div class="update-section" id="${element.id}">
                            </div>
                        </div>
                    `);
          
                    let userId = element.userId;
                    $.ajax({
                        url: URL + `user/${userId}`,
                        type: "GET",
                        success: function(data) {
                            console.log("userId", userId);
                            document.getElementById(`${userId}`).innerHTML = data.firstName + ' ' + data.lastName;
                        },
                        statusCode: {
                            404: function(data) {
                                const errorMsg = JSON.parse(data.responseText).Error;
                                // alert(errorMsg);
                            }
                        }
                    });
                }); 
                
                // Show the New Review section
                showCreateReviewSection();

                // Show Update and Delete buttons only for the Member that created that Review
                $('.updateReview').each(function () {
                    let userId = $(this).attr('data-user-id');
                    console.log("userId", userId);
                    if (loggedInMemberId === undefined) {
                        $('.updateReview').hide();
                        $('.deleteReview').hide();
                    }
                    if (loggedInMemberId === userId) {
                        $(`[data-user-id="${userId}"]`).show();
                    } else {
                        $(`[data-user-id="${userId}"]`).hide();
                    }
                });
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent6").append(`
                        <h3 class="modal-subtitle">Reviews</h3>
                        <div class="modal-box">
                            <p><i>No Reviews are available for this Movie!</i></p>
                        </div>
                    `);

                    // Show the New Review section
                    showCreateReviewSection();
                }
            }
        });
    };

    // Show Create Review Section
    function showCreateReviewSection() {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        if (loggedInMemberId) {
            $("#modalInfoContent6").append(`
            </br>
            <hr>
            <h3 class="modal-subtitle">New Review</h3>
            <form id="createReviewForm">
                <div class="form-group form-custom">
                    <label for="reviewTitle">Title</label>
                    <input type="text" id="reviewTitle" class="form-control" required>
                    <label for="reviewContent">Content</label>
                    <textarea id="reviewContent" class="form-control" rows="3"></textarea>
                    <div class="modal-actions">
                        <button type="submit" id="createReview" class="btn btn-success btn-3" data-dismiss="modal">Create Review</button>
                    </div>
                </div>
            </form>
            `);
        } else {
            $("#modalInfoContent6").append(`
                <p class="alert alert-warning">To create a Review, you must be Logged in as a Member!</p>
            `);
        }
    };

    // Create Movie Review - Form Processing
    $(document).on("click", "#createReview", function(e) {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
        const title = $("#reviewTitle").val(); 
        const content = $("#reviewContent").val(); 

        if (loggedInMemberId === undefined) {
            alert("To create a Review, you must be Logged in as a Member!");
        } else {
            $.ajax({
                url: URL + `review`,
                type: "POST",
                data: {
                    userId: loggedInMemberId,
                    movieId: movieId,
                    title: title,
                    content: content
                },
                success: function(data) {
                    alert('Movie Review was successfully created!');
                },
                statusCode: {
                    400: function(data) {
                        alert(data.responseJSON.message);
                    },
                    404: function(data) {
                        alert(data.responseJSON.message);
                    },
                    409: function(data) {
                        alert(data.responseJSON.message);
                    }
                }
            });
        }
    });

    // Update Movie Review
    $(document).on("click", ".updateReview", function() {
        const id = $(this).attr("data-id");
        console.log("id", id);
        $.ajax({
            url: URL + `review/${id}`,
            type: "GET",
            success: function(data) {
                $(`#${id}`).append(`
                    </br>
                    <hr>
                    <h3 class="modal-subtitle">Update Review</h3>
                    <form id="createReviewForm">
                        <div class="form-group form-custom">
                            <label for="reviewTitleUpdate">Title</label>
                            <input type="text" id="reviewTitleUpdate" class="form-control" value="${data.title}" required>
                            <label for="reviewContentUpdate">Content</label>
                            <textarea id="reviewContentUpdate" class="form-control" rows="3">${data.content}</textarea>
                            <div class="modal-actions">
                                <button type="submit" id="updateReviewConfirm" review-id="${id}" class="btn btn-success btn-3" data-dismiss="modal">Update Review</button>
                            </div>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    alert(data.responseJSON.message);
                }
            }
        });
    });

    // Update Movie Review - Form Processing
    $(document).on("click", "#updateReviewConfirm", function(e) {
        const reviewId = $(this).attr("review-id");
        const title = $("#reviewTitleUpdate").val(); 
        const content = $("#reviewContentUpdate").val();
        $.ajax({
            url: URL + `review/${reviewId}`,
            type: "PUT",
            data: {
                title: title,
                content: content
            },
            success: function(data) {
                alert('Review was successfully updated!');
            },
            statusCode: {
                400: function(data) {
                    alert(data.responseJSON.message);
                },
                404: function(data) {
                    alert(data.responseJSON.message);
                },
                409: function(data) {
                    alert(data.responseJSON.message);
                }
            }
        });
    });

    // Delete Movie Rating
    $(document).on("click", ".deleteReview", function(e) {
        const id = $(this).attr("data-id");
        if (confirm("Are you sure that you want to delete this Review?")) {
            if (id !== null) {
                $.ajax({
                    url: URL + `review/${id}`,
                    type: "DELETE",
                    success: function(data) {
                        // Close the modal
                        $('#modal > div > div > div.modal-header > button').click();
                        alert('Review was successfully deleted!');
                    },
                    statusCode: {
                        400: function(data) {
                            alert(data.responseJSON.message);
                        },
                        404: function(data) {
                            alert(data.responseJSON.message);
                        },
                        409: function(data) {
                            alert(data.responseJSON.message);
                        }
                    }
                });
            }
        }
    });

    // ******************************************************
    // ***                                                ***
    // ***                 User Functionality             ***
    // ***                                                ***
    // ******************************************************

    // Show User - Open Modal
    $(document).on("click", ".showUserModal", function() {
        const id = $(this).attr("data-id");
        clearModalData();
        showUserDetails(id);
    });

    // Create User - Open Modal
    $(document).on("click", "#btnCreateMember", function() {
        clearModalData();
        $("#modalTitle").html("Create Member");   
        $("#modalInfoContent1").append(`
            <form id="createUserForm">
                <div class="form-group form-custom">
                    <label for="username">Username</label>
                    <input type="text" id="username" class="form-control" required>
                    <label for="password">Password</label>
                    <input type="password" id="password" class="form-control" required>
                    <div class="modal-actions">
                        <button type="submit" id="createUser" class="btn btn-success btn-3" data-dismiss="modal">Create Member</button>
                    </div>
                </div>
            </form>
        `);     
    });

    // Create User - Form Processing
    $(document).on("click", "#createUser", function(e) {
        const username = $("#username").val(); 
        const password = $("#password").val(); 

        if (username === null || username.length === 0) {
            alert("The field User Name can not be empty!");
        } else if (password === null || password.length === 0) {
            alert("The field Password can not be empty!");
        } else if (INVALID_TEXT.test(username)) {
            alert("The field User Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(password)) {
            alert("The field Password can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `user`,
                type: "POST",
                data: {
                    username: username,
                    password: password,
                },
                success: function(data) {
                    // Show the updated List of Users
                    showAllUsers('admin');
                    // Scroll to the created User
                    scrollPage("bottomPage");
                    alert('User was successfully created!');
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
    });

    // Update User - Open Modal
    $(document).on("click", ".updateUserModal", function() {
        const id = $(this).attr("data-id");
        // const id = $('#loggedInMember').attr("data-id");
        clearModalData();
        $.ajax({
            url: URL + `user/${id}`,
            type: "GET",
            success: function(data) {
                $("#modalTitle").html("Update Member");   
                $("#modalInfoContent1").append(`
                    <form id="createUserForm">
                        <div class="form-group form-custom">
                            <label for="userId">User Id</label>
                            <input type="text" id="userId" class="form-control" value="${data.id}" disabled>
                            <label for="username">Username</label>
                            <input type="text" id="username" class="form-control" value="${data.username}" required>
                            <label for="firstName">First Name</label>
                            <input type="text" id="firstName" class="form-control" value="${data.firstName}">
                            <label for="lastName">Last Name</label>
                            <input type="text" id="lastName" class="form-control" value="${data.lastName}">
                            <label for="gender">Gender</label>
                            <input type="text" id="gender" class="form-control" value="${data.gender}">
                            <label for="birthday">Birthday</label>
                            <input type="date" id="birthday" class="form-control" value="${formatDate(data.birthday)}">
                            <label for="country">Country</label>
                            <input type="text" id="country" class="form-control" value="${data.country}">
                            <label for="createdAt">Created At</label>
                            <input type="text" id="createdAt" class="form-control" value="${formatDate(data.createdAt)}" disabled>
                            <div class="modal-actions">
                                <button type="submit" id="updateUser" class="btn btn-success btn-3" data-dismiss="modal">Update Member</button>
                            </div>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent1").append(`
                        <div class="modal-box">
                            <p><i>No User Details are available for this User!</i></p>
                        </div>
                    `);
                }
            }
        });
    });

    // Update User - Form Processing
    $(document).on("click", "#updateUser", function(e) {
        console.log('#updateUser');
        const userId = $("#userId").val(); 
        const username = $("#username").val(); 
        const firstName = $("#firstName").val(); 
        const lastName = $("#lastName").val(); 
        const gender = $("#gender").val(); 
        const birthday = $("#birthday").val(); 
        const country = $("#country").val(); 

        if (username === null || username.length === 0) {
            alert("The field User Name can not be empty!");
        } else if (INVALID_TEXT.test(username)) {
            alert("The field User Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(firstName)) {
            alert("The field First Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(lastName)) {
            alert("The field Last Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(gender)) {
            alert("The field Gender can not contain invalid characters!");
        } else if (INVALID_TEXT.test(birthday)) {
            alert("The field Birthday can not contain invalid characters!");
        } else if (INVALID_TEXT.test(country)) {
            alert("The field Country can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `user/${userId}`,
                type: "PUT",
                data: {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    birthday: birthday,
                    country: country,
                },
                success: function(data) {
                    // Show the updated List of Users
                    showAllUsers('admin');
                    // Scroll to the updated User
                    scrollPage(e.pageY);
                    alert('User was successfully updated!');
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
    });

    // Delete User
    $(document).on("click", ".deleteUser", function(e) {
        const id = $(this).attr("data-id");
        console.log("id", id);

        if (confirm("Are you sure that you want to delete this User?")) {
            if (id !== null) {
                $.ajax({
                    url: URL + `user/${id}`,
                    type: "DELETE",
                    success: function(data) {
                        // Show the updated List of Users
                        showAllUsers('admin');
                        // Scroll to the deleted User
                        scrollPage(e.pageY);
                        alert('User was successfully deleted!');
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

    // Show all Users in a List
    function showAllUsers(user = 'guest') {
        $.ajax({
            url: URL + "user",
            type: "GET",
            success: function(users) {
                console.log('users: ', users);
                displayUsers(users, user);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    }

    // Search Users - Show all Users in a List
    $("#memberSearchForm").on("submit", function(e) {
        e.preventDefault();
        const searchInput = $('#searchMember').val();
        $.ajax({
            url: URL + `user/username/search?username=${searchInput}`,
            type: "GET",
            success: function(users) {
                console.log('users: ', users);
                if (window.location.href === 'http://localhost:4000/src/admins.html' || window.location.href === 'http://localhost:4000/src/admins.html?') {
                    displayUsers(users, 'admin');
                }
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    $("#results").empty().append(`
                        <p class="alert alert-warning">${errorMessage}</p>
                    `);
                }
            }
        });
    });

    function displayUsers(users, user = 'guest') {
        $("section#userResults").empty();
        $("#results").empty();
        if (users.length === 0) {
            $("section#userResults").html("There are no Users matching the entered text.");
        } else {
            users.forEach(element => {
                // TODO: Simplify
                if (user == 'guest') {
                    
                } else if (user == 'member') {
 
                } else if (user == 'admin') {
                    $("#results").append(`
                        <div class="card">
                            <div class="card-body showUserModal" data-id="${element.id}" data-toggle="modal" data-target="#modal">
                                <h5 class="card-title">${element.firstName} ${element.lastName} - ${element.username}</h5>
                            </div>
                            <div class="card-actions">
                                <button data-id="${element.id}" type="button" class="btn btn-success updateUserModal" 
                                        data-toggle="modal" data-target="#modal">Update</button>
                                <button data-id="${element.id}" type="button" class="btn btn-danger deleteUser">Delete</button>
                            </div>
                        </div>
                    `);
                }
            });
        }
    }

    // Show User Details - Open Modal
    function showUserDetails(id) {
        $.ajax({
            url: URL + `user/${id}`,
            type: "GET",
            success: function(data) {
                console.log('data: ', data);
                $("#modalTitle").html("User Details");           
                $("#modalInfoContent1").append(`
                    <div class="modal-box">
                        <p>
                            <span class="tag">Id</span>
                            <span class="tag-info">${data.id}</span>
                        </p>
                        <p>
                            <span class="tag">Username</span>
                            <span class="tag-info">${data.username}</span>
                        </p>
                        <p>
                            <span class="tag">First Name</span>
                            <span class="tag-info">${data.firstName}</span>
                        </p>
                        <p>
                            <span class="tag">Last Name</span>
                            <span class="tag-info">${data.lastName}</span>
                        </p>
                        <p>
                            <span class="tag">Gender</span>
                            <span class="tag-info">${data.gender}</span>
                        </p>
                        <p>
                            <span class="tag">Birthday</span>
                            <span class="tag-info">${formatDate(data.birthday)}</span>
                        </p>
                        <p>
                            <span class="tag">Country</span>
                            <span class="tag-info">${data.country}</span>
                        </p>
                        <p>
                            <span class="tag">Created At</span>
                            <span class="tag-info">${formatDate(data.createdAt)}</span>
                        </p>
                    </div>
                `)
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent1").append(`
                        <div class="modal-box">
                            <p><i>No User Details are available for this User!</i></p>
                        </div>
                    `);
                }
            }
        });
    };

    // --------------------------------
    // Update User Profile
    // --------------------------------

    // Update User - Open Modal
    $(document).on("click", "#updateProfileModal", function() {
        // const id = $(this).attr("data-id");
        const id = $('#loggedInMember').attr("data-id");
        clearModalData();
        $.ajax({
            url: URL + `user/${id}`,
            type: "GET",
            success: function(data) {
                $("#modalTitle").html("Update User Profile");   
                $("#modalInfoContent1").append(`
                    <form id="createUserForm">
                        <div class="form-group form-custom">
                            <label for="userId">User Id</label>
                            <input type="text" id="userId" class="form-control" value="${data.id}" disabled>
                            <label for="username">Username</label>
                            <input type="text" id="username" class="form-control" value="${data.username}" required>
                            <label for="firstName">First Name</label>
                            <input type="text" id="firstName" class="form-control" value="${data.firstName}">
                            <label for="lastName">Last Name</label>
                            <input type="text" id="lastName" class="form-control" value="${data.lastName}">
                            <label for="gender">Gender</label>
                            <input type="text" id="gender" class="form-control" value="${data.gender}">
                            <label for="birthday">Birthday</label>
                            <input type="date" id="birthday" class="form-control" value="${formatDate(data.birthday)}">
                            <label for="country">Country</label>
                            <input type="text" id="country" class="form-control" value="${data.country}">
                            <label for="createdAt">Created At</label>
                            <input type="text" id="createdAt" class="form-control" value="${formatDate(data.createdAt)}" disabled>
                            <div class="modal-actions">
                                <button type="submit" id="updateUserProfile" class="btn btn-success btn-3" data-dismiss="modal">Update Member</button>
                            </div>
                        </div>
                    </form>
                `);
                $("#modalInfoContent2").append(`
                    </br>
                    <hr>
                    <h3 class="modal-subtitle">Update Password</h3>
                    <form id="updatePasswordUserForm">
                        <div class="form-group form-custom">
                            <label for="oldPassword">OldPassword</label>
                            <input type="password" id="oldPassword" class="form-control" required>
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" class="form-control" required>
                            <div class="modal-actions">
                                <button type="submit" id="updateUserPassword" class="btn btn-success btn-3" data-dismiss="modal">Update Password</button>
                            </div>
                        </div>
                    </form>
                `);    
                $("#modalInfoContent3").append(`
                    </br>
                    <hr>
                    <h3 class="modal-subtitle">Delete Profile</h3>
                    <div class="modal-actions">
                        <button type="submit" id="deleteUser" class="btn btn-danger btn-3" data-dismiss="modal">Delete</button>
                    </div>
                `);    
            },
            statusCode: {
                404: function(data) {
                    $("#modalInfoContent1").append(`
                        <div class="modal-box">
                            <p><i>No User Details are available for this User!</i></p>
                        </div>
                    `);
                }
            }
        });
    });

    // Update User - Form Processing
    $(document).on("click", "#updateUserProfile", function(e) {
        console.log('#updateUser');
        const userId = $("#userId").val(); 
        const username = $("#username").val(); 
        const firstName = $("#firstName").val(); 
        const lastName = $("#lastName").val(); 
        const gender = $("#gender").val(); 
        const birthday = $("#birthday").val(); 
        const country = $("#country").val(); 

        if (username === null || username.length === 0) {
            alert("The field User Name can not be empty!");
        } else if (INVALID_TEXT.test(username)) {
            alert("The field User Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(firstName)) {
            alert("The field First Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(lastName)) {
            alert("The field Last Name can not contain invalid characters!");
        } else if (INVALID_TEXT.test(gender)) {
            alert("The field Gender can not contain invalid characters!");
        } else if (INVALID_TEXT.test(birthday)) {
            alert("The field Birthday can not contain invalid characters!");
        } else if (INVALID_TEXT.test(country)) {
            alert("The field Country can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `user/${userId}`,
                type: "PUT",
                data: {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    birthday: birthday,
                    country: country,
                },
                success: function(data) {
                    alert('User was successfully updated!');
                    $("#memberLogout").click();
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
    });

    // Update User Password - Form Processing
    $(document).on("click", "#updateUserPassword", function(e) {
        console.log('#updateUserPassword');
        const userId = $("#userId").val(); 
        const oldPassword = $("#oldPassword").val(); 
        const newPassword = $("#newPassword").val(); 

        if (oldPassword === null || oldPassword.length === 0) {
            alert("The field Old Password can not be empty!");
        } else if (newPassword === null || newPassword.length === 0) {
            alert("The field New Password can not be empty!");
        } else if (INVALID_TEXT.test(oldPassword)) {
            alert("The field Old Password can not contain invalid characters!");
        } else if (INVALID_TEXT.test(newPassword)) {
            alert("The field New Password can not contain invalid characters!");
        } else {
            $.ajax({
                url: URL + `user/password/${userId}`,
                type: "PUT",
                data: {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                success: function(data) {
                    alert('User Password was successfully updated!');
                    $("#memberLogout").click();
                },
                statusCode: {
                    400: function(data) {
                        alert(data.responseJSON.message);
                    },
                    403: function(data) {
                        alert(data.responseJSON.message);
                    },
                    404: function(data) {
                        alert(data.responseJSON.message);
                    },
                    409: function(data) {
                        alert(data.responseJSON.message);
                    }
                }
            });
        }
    });

    // Delete User - Form Processing
    $(document).on("click", "#deleteUser", function(e) {
        const id = $('#loggedInMember').attr("data-id");
        if (confirm("Are you sure that you want to delete your User Profile?")) {
            if (id !== null) {
                $.ajax({
                    url: URL + `user/${id}`,
                    type: "DELETE",
                    success: function(data) {
                        alert('User Profile was successfully deleted!');
                        $("#memberLogout").click();
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMsg = JSON.parse(data.responseText).Error;
                            alert(errorMsg);
                        },
                        404: function(data) {
                            const errorMsg = JSON.parse(data.responseText).Error;
                            alert(errorMsg);
                        }
                    }
                });
            }
        }
    });
});
