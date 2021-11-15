$(document).ready(function() {
    // Crew details
    $(document).on("click", ".crewInfo", function() {
        const crewId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                if(crew.mainActivity === null || crew.mainActivity === '') {
                    crew.mainActivity = "This person's main activity is not in our database!";
                }
                if(crew.birthPlace === null || crew.birthPlace === '') {
                    crew.birthPlace = "This person's birth place is not in our database!";
                }
                if(crew.biography === null || crew.biography === '') {
                    crew.biography = "This person's biography is not in our database!";
                }
                $("#modalTitle").text(`${crew.name} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div class="modal-image">
                        <img class="card-img-top" src="${crew.picture}">
                    </div>
                    <br>
                    <h3 class="modal-subtitle">Overview</h3>
                    <div class="modal-box">
                        <p id="name"><span class="tag">Name: </span><span class="tag-info">${crew.name}</span></p>
                        <p id="mainActivity"><span class="tag">Main Activity: </span><span class="tag-info">${crew.mainActivity}</span></p>
                        <p id="dateOfBirth"><span class="tag">Birthday: </span><span class="tag-info">${dateOfBirth}</span></p>
                        <p id="birthPlace"><span class="tag">Birth place: </span><span class="tag-info">${crew.birthPlace}</span></p>
                        <p id="biography"><span class="tag">Biography: </span><span class="tag-info">${crew.biography}</span></p>
                        <p id="website"><span class="tag">Website: </span><span class="tag-info" id="websiteContent"><a id="websiteLink" href="${crew.website}" target="_blank">${crew.website}</a></span></p>
                    </div>
                    <h3 class="modal-subtitle">Movies List</h3>
                    <div class="modal-box">
                        <p id="movies">
                            <span id="actorListName"></span>
                            <span class="tag-info"><div id="actorList"></div></span>
                            <span id="directorListName"></span>
                            <span class="tag-info"><div id="directorList"></div></span>
                            <span id="producerListName"></span>
                            <span class="tag-info"><div id="producerList"></div></span>
                            <span id="executiveProducerListName"></span>
                            <span class="tag-info"><div id="executiveProducerList"></div></span>
                            <span id="scriptWriterListName"></span>
                            <span class="tag-info"><div id="scriptWriterList"></div></span>
                            <span id="musicComposerListName"></span>
                            <span class="tag-info"><div id="musicComposerList"></div></span>
                        </p>
                    </div>
                `);
                if(crew.website === null || crew.website === '') {
                    $('#websiteLink').remove();
                    $('#websiteContent').text('This person\'s website is not in our database!');
                }
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_arr) {
                        movie_crew_arr.forEach((movie_crew) => {
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    $.ajax({
                                        url: `${URLPath}/role/${movie_crew.roleId}`,
                                        type: "GET",
                                        success: function(role) {
                                            let releaseDate = formatDate(movie.releaseDate);
                                            let movieContent = `
                                                        <div class="card">
                                                            <div class="card-body">
                                                                <img data-id="${movie.id}" class="card-img-top poster showMovieModal" src="${movie.poster}">
                                                                <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                                <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                                <p id="role"><b>Role: </b>${role.name}</p>
                                                            </div>
                                                            <div class="card-actions">
                                                                <button data-id="${movie.id}" type="button" class="btn btn-warning
                                                                        btnShow showMovieModal">Details</button>
                                                            </div>
                                                        </div>
                                                    `;
                                            switch (role.name) {
                                                case 'Actor':
                                                    $('#actorListName').text('Actor:');
                                                    $('#actorListName').addClass('tag');
                                                    $('#actorList').append(movieContent);
                                                    break;
                                                case 'Director':
                                                    $('#directorListName').text('Director:');
                                                    $('#directorListName').addClass('tag');
                                                    $("#directorList").append(movieContent);
                                                    break;
                                                case 'Producer':
                                                    $('#producerListName').text('Producer:');
                                                    $('#producerListName').addClass('tag');
                                                    $("#producerList").append(movieContent);
                                                    break;
                                                case 'Executive Producer':
                                                    $('#executiveProducerListName').text('Executive Producer:');
                                                    $('#executiveProducerListName').addClass('tag');
                                                    $("#executiveProducerList").append(movieContent);
                                                    break;
                                                case 'Script Writer':
                                                    $('#scriptWriterListName').text('Script Writer:');
                                                    $('#scriptWriterListName').addClass('tag');
                                                    $("#scriptWriterList").append(movieContent);
                                                    break;
                                                case 'Music Composer':
                                                    $('#musicComposerListName').text('Music Composer:');
                                                    $('#musicComposerListName').addClass('tag');
                                                    $("#musicComposerList").append(movieContent);
                                                    break;
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    },
                    statusCode: {
                        404: function() {
                            $("#listOfMovies").append(`
                                <p><b>This person was not part in any movie yet!</b></p>
                            `);
                        }
                    }
                });
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    });

    // Search Crew
    $("#crewSearchForm").on("submit", function(e) {
        e.preventDefault();
        const searchValue = $('#searchCrew').val();
        $.ajax({
            url: `${URLPath}/crew/name/search?name=${searchValue}`,
            type: "GET",
            success: function(crews) {
                if (window.location.href === 'http://localhost:4000/src/admins.html' || window.location.href === 'http://localhost:4000/src/admins.html?') {
                    showCrews(crews, 'admin');
                } else {
                    showCrews(crews, 'guest');
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

    // Create Crew
    $(document).on("click", "#btnCreateCrew", function() {
        clearModalData();
        $("#modalTitle").text(`Create Crew`);
        $("#modalInfoContent1").append(`
             <form id="createCrewForm">
                <div class="form-group form-custom">
                    <label for="crewName">Crew Name</label>
                    <input type="text" class="form-control" id="crewName" required>
                    <label for="crewMainActivity">Main Activity</label>
                    <input type="text" class="form-control" id="crewMainActivity">
                    <label for="crewDateOfBirth">Date of Birth</label>
                    <input type="date" class="form-control" id="crewDateOfBirth">
                    <label for="crewBirthPlace">Birth Place</label>
                    <input type="text" class="form-control" id="crewBirthPlace">
                    <label for="crewBiography">Biography</label>
                    <textarea class="form-control" id="crewBiography" rows="3"></textarea>
                    <label for="crewWebsite">Website</label>
                    <input type="text" class="form-control" id="crewWebsite">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-success btn-3">Create Crew</button>
                </div>
             </form>
        `);
        $("#createCrewForm").on("submit", function(e) {
            e.preventDefault();
            const name = $("#crewName").val().trim();
            const mainActivity = $("#crewMainActivity").val().trim();
            const dateOfBirth = $("#crewDateOfBirth").val().trim();
            const birthPlace = $("#crewBirthPlace").val().trim();
            const biography = $("#crewBiography").val().trim();
            const website = $("#crewWebsite").val().trim();

            if (name === null || name.length === 0) {
                alert("The crew name should not be empty!");
            } else if(name.match('[=!@#$%^*?":{}|<>;]')) {
                alert("The input field can't contain invalid characters!");
            } else {
                $.ajax({
                    url: `https://api.themoviedb.org/3/search/person?api_key=3510eb3c9c4e835718fa818f6bbb1309&query=${name}`,
                    type: "GET",
                    success: function(data) {
                        let person = data["results"][0];
                        let personPicture;
                        if(person === undefined || person.profile_path === null) {
                            personPicture = "../img/notFoundPicture.jpg";
                        } else {
                            personPicture = `//image.tmdb.org/t/p/w300_and_h450_bestv2${person.profile_path}`;
                        }

                        $.ajax({
                            url: `${URLPath}/crew`,
                            type: "POST",
                            data: {
                                name: name,
                                mainActivity: mainActivity,
                                dateOfBirth: dateOfBirth,
                                birthPlace: birthPlace,
                                biography: biography,
                                picture: personPicture,
                                website: website
                            },
                            success: function() {
                                alert("The crew was successfully created!");
                                $('#modal > div > div > div.modal-header > button').click();
                                $('#btnCrewsTab').click();
                                setTimeout(function(){
                                    scrollPage("bottomPage");
                                }, 1000);
                            },
                            statusCode: {
                                400: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                },
                                409: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    // Update Crew
    $(document).on("click", ".crewUpdate", function() {
        const crewId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                $("#modalTitle").text(`Update Crew`);
                if(crew.mainActivity === null || crew.mainActivity === '') {
                    crew.mainActivity = "";
                }
                if(crew.birthPlace === null || crew.birthPlace === '') {
                    crew.birthPlace = "";
                }
                if(crew.biography === null || crew.biography === '') {
                    crew.biography = "";
                }
                if(crew.website === null || crew.website === '') {
                    crew.website = "";
                }
                $("#modalInfoContent1").append(`
                    <form id="updateCrewForm">
                        <div class="form-group form-custom">
                            <label for="crewName">Crew Name</label>
                            <input type="text" class="form-control" id="crewName" value="${crew.name}" required>
                            <label for="crewMainActivity">Main Activity</label>
                            <input type="text" class="form-control" id="crewMainActivity" value="${crew.mainActivity}">
                            <label for="crewDateOfBirth">Date of Birth</label>
                            <input type="date" class="form-control" id="crewDateOfBirth" value="${dateOfBirth}">
                            <label for="crewBirthPlace">Birth Place</label>
                            <input type="text" class="form-control" id="crewBirthPlace" value="${crew.birthPlace}">
                            <label for="crewBiography">Biography</label>
                            <textarea class="form-control" id="crewBiography" rows="3">${crew.biography}</textarea>
                            <label for="crewWebsite">Website</label>
                            <input type="text" class="form-control" id="crewWebsite" value="${crew.website}">
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Crew</button>
                        </div>
                    </form>
                `);
                $("#modalInfoContent2").append(`
                    </br>
                    <hr>
                    </br>
                    <form id="crewMovieForm">
                        <div class="form-group form-custom">
                            <h3 class="modal-subtitle">Movies List</h3>
                            <div class="modal-box">
                                <p id="movies">
                                    <span id="actorListName"></span>
                                    <span class="tag-info"><div id="actorList"></div></span>
                                    <span id="directorListName"></span>
                                    <span class="tag-info"><div id="directorList"></div></span>
                                    <span id="producerListName"></span>
                                    <span class="tag-info"><div id="producerList"></div></span>
                                    <span id="executiveProducerListName"></span>
                                    <span class="tag-info"><div id="executiveProducerList"></div></span>
                                    <span id="scriptWriterListName"></span>
                                    <span class="tag-info"><div id="scriptWriterList"></div></span>
                                    <span id="musicComposerListName"></span>
                                    <span class="tag-info"><div id="musicComposerList"></div></span>
                                </p>
                            </div>
                            </br>
                            <hr>
                            </br>
                            <h3 class="modal-subtitle">Crew - Add Movies and Role</h3>
                            <label for="moviesDropdown">Movie</label>
                            <select name="moviesDropdown" id="moviesDropdown" class="form-control"></select>
                            <label for="rolesDropdown">Role</label>
                            <select name="rolesDropdown" id="rolesDropdown" class="form-control"></select>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Add Movie and Role</button>
                        </div>
                    </form>
                `);
                // Get the list of movies
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_arr) {
                        movie_crew_arr.forEach((movie_crew) => {
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    $.ajax({
                                        url: `${URLPath}/role/${movie_crew.roleId}`,
                                        type: "GET",
                                        success: function(role) {
                                            let releaseDate = formatDate(movie.releaseDate);
                                            let movieContent = `
                                                        <div class="card">
                                                            <div class="card-body">
                                                                <img data-id="${movie.id}" class="card-img-top poster showMovieModal" src="${movie.poster}">
                                                                <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                                <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                                <p id="role"><b>Role: </b>${role.name}</p>
                                                            </div>
                                                            <div class="card-actions">
                                                                <button data-id="${movie.id}" type="button" class="btn btn-warning
                                                                        btnShow showMovieModal">Details</button>
                                                            </div>
                                                        </div>
                                                    `;
                                            switch (role.name) {
                                                case 'Actor':
                                                    $('#actorListName').text('Actor:');
                                                    $('#actorListName').addClass('tag');
                                                    $('#actorList').append(movieContent);
                                                    break;
                                                case 'Director':
                                                    $('#directorListName').text('Director:');
                                                    $('#directorListName').addClass('tag');
                                                    $("#directorList").append(movieContent);
                                                    break;
                                                case 'Producer':
                                                    $('#producerListName').text('Producer:');
                                                    $('#producerListName').addClass('tag');
                                                    $("#producerList").append(movieContent);
                                                    break;
                                                case 'Executive Producer':
                                                    $('#executiveProducerListName').text('Executive Producer:');
                                                    $('#executiveProducerListName').addClass('tag');
                                                    $("#executiveProducerList").append(movieContent);
                                                    break;
                                                case 'Script Writer':
                                                    $('#scriptWriterListName').text('Script Writer:');
                                                    $('#scriptWriterListName').addClass('tag');
                                                    $("#scriptWriterList").append(movieContent);
                                                    break;
                                                case 'Music Composer':
                                                    $('#musicComposerListName').text('Music Composer:');
                                                    $('#musicComposerListName').addClass('tag');
                                                    $("#musicComposerList").append(movieContent);
                                                    break;
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    },
                    statusCode: {
                        404: function() {
                            $("#listOfMovies").append(`
                                <p><b>This person was not part in any movie yet!</b></p>
                            `);
                        }
                    }
                });
                // Populate the movies dropdown
                $.ajax({
                    url: `${URLPath}/movie`,
                    type: "GET",
                    success: function(movies) {
                        movies.forEach((movie) => {
                            $('#moviesDropdown').append(`
                                <option value="${movie.id}">${movie.title}</option>
                            `);
                        })
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
                // Populate the roles dropdown
                $.ajax({
                    url: `${URLPath}/role`,
                    type: "GET",
                    success: function(roles) {
                        roles.forEach((role) => {
                            $('#rolesDropdown').append(`
                                <option value="${role.id}">${role.name}</option>
                            `);
                        })
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#updateCrewForm").on("submit", function(e) {
                    e.preventDefault();
                    const name = $("#crewName").val().trim();
                    const mainActivity = $("#crewMainActivity").val().trim();
                    const dateOfBirth = $("#crewDateOfBirth").val().trim();
                    const birthPlace = $("#crewBirthPlace").val().trim();
                    const biography = $("#crewBiography").val().trim();
                    const website = $("#crewWebsite").val().trim();
                    $.ajax({
                        url: `${URLPath}/crew/${crewId}`,
                        type: "PUT",
                        data: {
                            name: name,
                            mainActivity: mainActivity,
                            dateOfBirth: dateOfBirth,
                            birthPlace: birthPlace,
                            biography: biography,
                            website: website
                        },
                        success: function() {
                            alert("The crew was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#btnCrewsTab').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
                $("#crewMovieForm").on("submit", function(e) {
                    e.preventDefault();
                    const movieId = $("#moviesDropdown option:selected").val()
                    const roleId = $("#rolesDropdown option:selected").val();

                    $.ajax({
                        url: `${URLPath}/movie_crew`,
                        type: "POST",
                        data: {
                            movieId: movieId,
                            crewId: crewId,
                            roleId: roleId
                        },
                        success: function() {
                            alert("The movie and role were successfully linked with this crew member!");
                            $('#modal > div > div > div.modal-header > button').click();

                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            404: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Crew
    $(document).on("click", ".crewDelete", function() {
        const crewId = $(this).attr("data-id");
        if (confirm("Are you sure that you want to delete this crew?")) {
            $.ajax({
                url: `${URLPath}/crew/${crewId}`,
                type: "DELETE",
                success: function() {
                    $("button[data-id=" + crewId + "]").parent().parent().remove();

                    alert("The crew was successfully deleted!");
                },
                statusCode: {
                    400: function(data) {
                        const errorMessage = data.responseJSON.message;
                        alert(errorMessage);
                    }
                }
            });
        }
    });

    // Member login form submit listener
    $("#loginMemberForm").on("submit", function(e) {
        e.preventDefault();
        const memberUsername = $('#memberUsername').val().trim();
        const memberPassword = $('#memberPassword').val().trim();
        $.ajax({
            url: `${URLPath}/user/login`,
            type: "POST",
            data: {
                username: memberUsername,
                password: memberPassword
            },
            success: function(data) {
                $.ajax({
                    url: `http://localhost:4000/login/member`,
                    type: "POST",
                    data: {
                        id: data.memberUser.id,
                        username: data.memberUser.username,
                        firstName: data.memberUser.firstName,
                        lastName: data.memberUser.lastName,
                        gender: data.memberUser.gender,
                        birthday: data.memberUser.birthday,
                        country: data.memberUser.country
                    },
                    success: function(response) {
                        if (response === 'Member session created!') {
                            window.location.href='../src/movies.html';
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                403: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            }
        });
    });

    // Admin login form submit listener
    $("#loginAdminForm").on("submit", function(e) {
        e.preventDefault();
        const adminUsername = $('#adminUsername').val().trim();
        const adminPassword = $('#adminPassword').val().trim();
        $.ajax({
            url: `${URLPath}/admin/login`,
            type: "POST",
            data: {
                username: adminUsername,
                password: adminPassword
            },
            success: function(data) {
                $.ajax({
                    url: `http://localhost:4000/login/admin`,
                    type: "POST",
                    data: {
                        id: data.adminUser.id,
                        username: data.adminUser.username
                    },
                    success: function(response) {
                        if (response === 'Admin session created!') {
                            window.location.href='../src/admins.html';
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                403: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            }
        });
    });

    // Logout
    $(document).on("click", "#adminLogout, #memberLogout", function() {
        $.ajax({
            url: `http://localhost:4000/logout`,
            type: "GET",
            success: function() {
                location.reload();
            }
        });
    });

    // ***** Admin CRUD *****
    // Admin details
    $(document).on("click", ".adminInfo", function() {
        const adminId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/admin/${adminId}`,
            type: "GET",
            success: function(admin) {
                let createdAt = formatDateTime(admin.createdAt);
                $("#modalTitle").text(`${admin.username} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div class="modal-box">
                        <p id="adminId"><span class="tag">Id: </span><span class="tag-info">${admin.id}</span></p>
                        <p id="username"><span class="tag">Username: </span><span class="tag-info">${admin.username}</span></p>
                        <p id="createdAt"><span class="tag">Created at: </span><span class="tag-info">${createdAt}</span></p>
                    </div>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    });

    // Search Admin
    $("#adminSearchForm").on("submit", function(e) {
        e.preventDefault();
        const searchValue = $('#searchAdmin').val();
        $.ajax({
            url: `${URLPath}/admin/username/search?username=${searchValue}`,
            type: "GET",
            success: function(admins) {
                showAdmins(admins);
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

    // Create Admin
    $(document).on("click", "#btnCreateAdmin", function() {
        clearModalData();
        $("#modalTitle").text(`Create Admin`);
        $("#modalInfoContent1").append(`
             <form id="createAdminForm">
                <div class="form-group form-custom">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" required>
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-success btn-3">Create Admin</button>
                </div>
             </form>
        `);
        $("#createAdminForm").on("submit", function(e) {
            e.preventDefault();
            const username = $("#username").val().trim();
            const password = $("#password").val().trim();

            if (username === null || username.length === 0) {
                alert("The username should not be empty!");
            } else if(username.match('[=!@#$%^*?":{}|<>;]')) {
                alert("The input field can't contain invalid characters!");
            } else {
                $.ajax({
                    url: `${URLPath}/admin`,
                    type: "POST",
                    data: {
                        username: username,
                        password: password
                    },
                    success: function() {
                        alert("The admin was successfully created!");
                        $('#modal > div > div > div.modal-header > button').click();
                        $('#btnAdminsTab').click();
                        setTimeout(function(){
                            scrollPage("bottomPage");
                        }, 1000);
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        },
                        409: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        });
    });

    // Update Admin
    $(document).on("click", ".adminUpdate", function() {
        const adminId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/admin/${adminId}`,
            type: "GET",
            success: function(admin) {
                $("#modalTitle").text(`Update Admin`);
                $("#modalInfoContent1").append(`
                    <form id="updateAdminForm">
                        <div class="form-group form-custom">
                            <label for="adminId">Id</label>
                            <input type="text" class="form-control" id="adminId" value="${admin.id}" disabled>
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" value="${admin.username}" required>
                            <label for="createdAt">Created at</label>
                            <input type="text" class="form-control" id="createdAt" value="${formatDateTime(admin.createdAt)}" disabled>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Admin</button>
                        </div>
                    </form>
                `);
                $("#modalInfoContent2").append(`
                    </br>
                    <hr>
                    </br>
                    <h3 class="modal-subtitle">Update Admin Password</h3>
                    <form id="updatePasswordAdminForm">
                        <div class="form-group form-custom">
                            <label for="oldPassword">Old Password</label>
                            <input type="password" id="oldPassword" class="form-control" required>
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" class="form-control" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Password</button>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#updateAdminForm").on("submit", function(e) {
                    e.preventDefault();
                    const username = $("#username").val().trim();

                    $.ajax({
                        url: `${URLPath}/admin/${adminId}`,
                        type: "PUT",
                        data: {
                            username: username
                        },
                        success: function() {
                            alert("The admin was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#btnAdminsTab').click();
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
                $("#updatePasswordAdminForm").on("submit", function(e) {
                    e.preventDefault();
                    const username = $("#username").val().trim();
                    const oldPassword = $("#oldPassword").val().trim();
                    const newPassword = $("#newPassword").val().trim();

                    $.ajax({
                        url: `${URLPath}/admin/password/${adminId}`,
                        type: "PUT",
                        data: {
                            username: username,
                            oldPassword: oldPassword,
                            newPassword: newPassword
                        },
                        success: function() {
                            alert("The admin password was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            403: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert('Wrong password!');
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Admin
    $(document).on("click", ".adminDelete", function() {
        const adminId = $(this).attr("data-id");
        const loggedInAdminId = $('#loggedInAdmin').attr("data-id");
        if (confirm("Are you sure that you want to delete this admin?")) {
            if (adminId === loggedInAdminId) {
                if (confirm("Warning! You're about to delete the account that you're logged in with. Do you want to proceed?")) {
                    $.ajax({
                        url: `${URLPath}/admin/${adminId}`,
                        type: "DELETE",
                        success: function() {
                            $("button[data-id=" + adminId + "]").parent().parent().remove();
                            alert("Your account was successfully deleted!");
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                }
            } else {
                $.ajax({
                    url: `${URLPath}/admin/${adminId}`,
                    type: "DELETE",
                    success: function() {
                        $("button[data-id=" + adminId + "]").parent().parent().remove();
                        alert("The admin was successfully deleted!");
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        }
    });

    // Create/Update rating
    $(document).on("click", ".rating", function() {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
        const ratingResult = $('.rating__result').text().split('/')[0];
        $.ajax({
            url: `${URLPath}/rating`,
            type: "POST",
            data: {
                userId: loggedInMemberId,
                movieId: movieId,
                value: ratingResult
            },
            success: function() {
                $.ajax({
                    url: `${URLPath}/rating/movie/${movieId}`,
                    type: "GET",
                    success: function(data) {
                        $('#ratingContent').hide();
                        $('.loader').show();
                        setTimeout(function(){
                            $('.loader').hide();
                            $('#ratingContent').show();
                        }, 3000);
                        if ($("#ratingText").text() === "No Ratings are available for this Movie!") {
                            $("#ratingText").empty().append(`
                                <span class="tag">Rating Average</span>
                                <span id="ratingAverage" class="tag-info">${calculateRatingAverage(data)}</span>
                            `);
                        }
                        ratingStarsSelection()
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                409: function(data) {
                    const errorMessage = data.responseJSON.message;

                    if (errorMessage === 'Rating from this User is already attached to this Movie!') {
                        $.ajax({
                            url: `${URLPath}/rating/movie/${movieId}/user/${loggedInMemberId}`,
                            type: "GET",
                            success: function(rating) {
                                // Update the rating
                                $.ajax({
                                    url: `${URLPath}/rating/${rating.id}`,
                                    type: "PUT",
                                    data: {
                                        value: ratingResult
                                    },
                                    success: function() {
                                        $.ajax({
                                            url: `${URLPath}/rating/movie/${movieId}`,
                                            type: "GET",
                                            success: function(data) {
                                                $('#ratingContent').hide();
                                                $('.loader').show();
                                                setTimeout(function(){
                                                    $('.loader').hide();
                                                    $('#ratingContent').show();
                                                }, 3000);
                                                $('#ratingAverage').text(calculateRatingAverage(data));
                                                ratingStarsSelection();
                                            },
                                            statusCode: {
                                                404: function(data) {
                                                    const errorMessage = data.responseJSON.message;
                                                    alert(errorMessage);
                                                }
                                            }
                                        });
                                    },
                                    statusCode: {
                                        400: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        },
                                        403: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        },
                                        409: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        }
                                    }
                                });
                            },
                            statusCode: {
                                400: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                },
                                404: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                }
                            }
                        });
                    } else {
                        alert(errorMessage);
                    }
                }
            }
        });
    });

    // Remove rating
    $(document).on("click", "#removeRating", function() {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
        if (loggedInMemberId === undefined) {
            alert("You must be logged in to be able to remove a rating!");
        } else {
            if (confirm( "Are you sure that you want to delete your rating?" )) {
                $.ajax( {
                    url: `${URLPath}/rating/movie/${movieId}/user/${loggedInMemberId}`,
                    type: "GET",
                    success: function (rating) {
                        $.ajax( {
                            url: `${URLPath}/rating/${rating.id}`,
                            type: "DELETE",
                            success: function () {
                                $('#modal > div > div > div.modal-header > button').click();
                            },
                            statusCode: {
                                400: function (data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert( errorMessage );
                                }
                            }
                        } );
                    },
                    statusCode: {
                        400: function (data) {
                            const errorMessage = data.responseJSON.message;
                            alert( errorMessage );
                        },
                        404: function (data) {
                            const errorMessage = data.responseJSON.message;
                        }
                    }
                } );
            }
        }
    });

    // ************** Chat functionality ****************
    // Room chat
    $(document).on("click", ".roomInfo", function() {
        const roomId = $(this).attr("data-id");
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const memberUsername = $('#loggedInMember').text().substring(13);

        $.ajax({
            url: `${URLPath}/room/${roomId}`,
            type: "GET",
            success: function(room) {
                chatMessages(roomId, loggedInMemberId);
                showMessages(roomId);
                // change the title of the room with the one chosen by the user
                $('.room-title').text(room.name);
                $('.room-title').attr('data-id', roomId);
                // show the chat
                $('.chat').show();
                if (memberUsername === '') {
                    $('#chatUsername').text('Guest User');
                } else {
                    $('#chatUsername').text(memberUsername);
                }
                showAllParticipantsOfARoom(roomId);
                window.scrollTo( 0, document.body.scrollHeight );
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    });

    // Create Room
    $(document).on("click", "#btnCreateRoom", function() {
        clearModalData();
        $("#modalTitle").text(`Create new Room`);
        $("#modalInfoContent1").append(`
             <form id="createRoomForm">
                <div class="form-group form-custom">
                    <label for="roomName">Room Name</label>
                    <input type="text" class="form-control" id="roomName" autocomplete="off" required>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-success btn-3">Create Room</button>
                </div>
             </form>
        `);
        $("#createRoomForm").on("submit", function(e) {
            e.preventDefault();
            const roomName = $("#roomName").val().trim();
            const loggedInMemberId = $('#loggedInMember').attr("data-id");

            if (loggedInMemberId === undefined) {
                alert("You must be logged in as a member to be able to create a room!");
            } else {
                if (roomName === null || roomName.length === 0) {
                    alert( "The room name should not be empty!" );
                } else if (roomName.match( '[=!@#$%^*?":{}|<>;]' )) {
                    alert( "The room name can't contain invalid characters!" );
                } else {
                    $.ajax( {
                        url: `${URLPath}/room`,
                        type: "POST",
                        data: {
                            name: roomName,
                            userId: loggedInMemberId
                        },
                        success: function () {
                            alert( "The room was successfully created!" );
                            $( '#modal > div > div > div.modal-header > button' ).click();
                            showAllRooms();
                        },
                        statusCode: {
                            400: function (data) {
                                const errorMessage = data.responseJSON.message;
                                alert( errorMessage );
                            },
                            409: function (data) {
                                const errorMessage = data.responseJSON.message;
                                alert( errorMessage );
                            }
                        }
                    });
                }
            }
        });
    });

    // Update Message
    $(document).on("click", ".messageUpdate", function() {
        const messageId = $(this).attr("data-id");
        const roomId = $('.room-title').attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/message/${messageId}`,
            type: "GET",
            success: function(message) {
                $("#modalTitle").text(`Update Message`);
                $("#modalInfoContent1").append(`
                    <form id="updateMessageForm">
                        <div class="form-group form-custom">
                            <label for="messageContent">Username</label>
                            <input type="text" class="form-control" id="messageContent" value="${message.content}" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Message</button>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#updateMessageForm").on("submit", function(e) {
                    e.preventDefault();
                    const messageContent = $("#messageContent").val().trim();

                    $.ajax({
                        url: `${URLPath}/message/${messageId}`,
                        type: "PUT",
                        data: {
                            content: messageContent
                        },
                        success: function() {
                            alert("The message was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            // showMessages(roomId);
                            const socket = io();
                            socket.emit('chat update delete');
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Message
    $(document).on("click", ".messageDelete", function() {
        const messageId = $(this).attr("data-id");
        const userId = $(this).attr("data-userid");
        const roomId = $('.room-title').attr("data-id");
        if (confirm("Are you sure that you want to delete this message?")) {
            $.ajax({
                url: `${URLPath}/message/${messageId}`,
                type: "DELETE",
                success: function() {
                    $("i[data-id=" + messageId + "]").parent().parent().parent().remove();
                    deleteRoomParticipant(roomId, userId);
                    alert("The message was successfully deleted!");
                    const socket = io();
                    socket.emit('chat update delete');
                },
                statusCode: {
                    400: function(data) {
                        const errorMessage = data.responseJSON.message;
                        alert(errorMessage);
                    }
                }
            });
        }
    });

    // Update Room
    $(document).on("click", ".roomUpdate", function() {
        const roomId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/room/${roomId}`,
            type: "GET",
            success: function(room) {
                $("#modalTitle").text(`Update Room`);
                $("#modalInfoContent1").append(`
                    <form id="roomMessageForm">
                        <div class="form-group form-custom">
                            <label for="roomName">Room Name</label>
                            <input type="text" class="form-control" id="roomName" value="${room.name}" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Room</button>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#roomMessageForm").on("submit", function(e) {
                    e.preventDefault();
                    const roomName = $("#roomName").val().trim();

                    $.ajax({
                        url: `${URLPath}/room/${roomId}`,
                        type: "PUT",
                        data: {
                            name: roomName
                        },
                        success: function() {
                            alert("The room was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            showAllRooms();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Room
    $(document).on("click", ".roomDelete", function() {
        const roomId = $(this).attr("data-id");
        if (confirm("Are you sure that you want to delete this room?")) {
            $.ajax({
                url: `${URLPath}/room/${roomId}`,
                type: "DELETE",
                success: function() {
                    $("button[data-id=" + roomId + "]").parent().parent().remove();
                    alert("The room was successfully deleted!");
                    location.reload();
                },
                statusCode: {
                    400: function(data) {
                        const errorMessage = data.responseJSON.message;
                        alert(errorMessage);
                    }
                }
            });
        }
    });
});

// Show all Crews in a List
function showAllCrews(user = 'guest') {
    $.ajax({
        url: `${URLPath}/crew`,
        type: "GET",
        success: function(crews) {
            showCrews(crews, user);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show Crews in a List
function showCrews(data, user = 'guest') {
    $("#results").empty();
    switch (user) {
        case 'guest':
            data.forEach(crew => {
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#results").append(`
                    <div class="card crewDiv">
                        <div data-id="${crew.id}" class="card-body crewInfo" data-toggle="modal" data-target="#modal">
                            <img  class="card-img-top poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-actions">
                            <button data-id="${crew.id}" type="button" class="btn btn-warning
                                    btnShow crewInfo detailsBtn" data-toggle="modal" data-target="#modal">Details</button>
                        </div>
                    </div>
                `);
            });
            break;
        case 'admin':
            data.forEach(crew => {
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#results").append(`
                    <div class="card crewDiv">
                        <div data-id="${crew.id}" class="card-body crewInfo" data-toggle="modal" data-target="#modal">
                            <img  class="card-img-top poster" src="${crew.picture}">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-actions">
                            <button data-id="${crew.id}" type="button" class="btn btn-success
                                    btnShow crewUpdate" data-toggle="modal" data-target="#modal">Update</button>
                            <button data-id="${crew.id}" type="button" class="btn btn-danger
                                btnShow crewDelete">Delete</button>
                        </div>
                    </div>
                `);
            });
            break;
    }
}

// Show all Admins in a List
function showAllAdmins() {
    $.ajax({
        url: `${URLPath}/admin`,
        type: "GET",
        success: function(admins) {
            showAdmins(admins);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show Admins in a List
function showAdmins(data) {
    $("#results").empty();
    data.forEach(admin => {
        $("#results").append(`
            <div class="card adminDiv">
                <div data-id="${admin.id}" class="card-body adminInfo" data-toggle="modal" data-target="#modal">
                    <h5 class="card-title">${admin.username}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Created on: </b>${formatDate(admin.createdAt)}</li>
                </ul>
                <div class="card-actions">
                    <button data-id="${admin.id}" type="button" class="btn btn-success
                            btnShow adminUpdate" data-toggle="modal" data-target="#modal">Update</button>
                    <button data-id="${admin.id}" type="button" class="btn btn-danger
                            btnShow adminDelete">Delete</button>
                </div>
            </div>
        `);
    });
}

// ******************************************************
// ***                                                ***
// ***            Community Functionality             ***
// ***                                                ***
// ******************************************************

// Show all Rooms in a List
function showAllRooms() {
    $.ajax({
        url: `${URLPath}/room`,
        type: "GET",
        success: function(rooms) {
            showRooms(rooms);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show Rooms in a List
function showRooms(data) {
    const loggedInMemberId = $('#loggedInMember').attr("data-id");
    if (loggedInMemberId === undefined) {
        $('#btnCreateRoom').attr('disabled', true);
    } else {
        $('#btnCreateRoom').attr('disabled', false);
    }
    $("#results").empty();
    $("#results2").empty();
    data.forEach(room => {
        if (room.userId === Number(loggedInMemberId)) {
            $("#results").append(`
            <div class="card">
                <div data-id="${room.id}" class="card-body roomInfo">
                    <h5 class="card-title">${room.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Created on: </b>${formatDate(room.createdAt)}</li>
                </ul>
                <div class="card-actions">
                    <button data-id="${room.id}" type="button" class="btn btn-warning
                            btnShow roomInfo">Open Room</button>
                    <button data-id="${room.id}" type="button" class="btn btn-success
                            btnShow roomUpdate" data-toggle="modal" data-target="#modal">Update</button>
                    <button data-id="${room.id}" type="button" class="btn btn-danger
                        btnShow roomDelete">Delete</button>
                </div>
            </div>
        `);
        } else {
            $("#results2").append(`
            <div class="card">
                <div data-id="${room.id}" class="card-body roomInfo">
                    <h5 class="card-title">${room.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Created on: </b>${formatDate(room.createdAt)}</li>
                </ul>
                <div class="card-actions">
                    <button data-id="${room.id}" type="button" class="btn btn-warning
                            btnShow roomInfo">Open Room</button>
                </div>
            </div>
        `);
        }
    });
}

// Show All messages of a room
function showMessages(roomId) {
    const loggedInMemberId = $('#loggedInMember').attr("data-id");
    $.ajax({
        url: `${URLPath}/message/room/${roomId}`,
        type: "GET",
        success: async function(messages) {
            $('#messages').empty();
            $('#messages').hide();
            $('.loader').show();
            setTimeout(function(){
                $('.loader').hide();
                $('#messages').show();
            }, 3000);
            for (let i=0; i<messages.length; i++) {
                const username = await getUsername (messages[i].userId);
                $("#messages").append(`
                   <div class="message">
                        <p>
                            <span class="message__name">${username}</span>
                            <span class="message__meta"></span>                          
                        </p>
                        <p>${messages[i].content}
                            <span class="createdAt">${formatDateTime(messages[i].createdAt)}</span>
                            <span class="messageUpdateDelete">
                                <i data-id="${messages[i].id}" data-userid="${messages[i].userId}" class="fas fa-edit messageUpdate" data-toggle="modal" data-target="#modal"></i>
                                <i data-id="${messages[i].id}" data-userid="${messages[i].userId}" class="fas fa-trash-alt messageDelete"></i>
                            </span>
                        </p>
                    </div>
                `);
                document.querySelector("#messages").scrollTo(0, document.querySelector("#messages").scrollHeight);
            }
            $('.messageUpdate').each(function () {
                let userId = $(this).attr('data-userid');

                if (loggedInMemberId === undefined) {
                    $('.messageUpdate').hide();
                    $('.messageDelete').hide();
                }
                if (loggedInMemberId === userId) {
                    $(`[data-userid="${userId}"]`).show();
                } else {
                    $(`[data-userid="${userId}"]`).hide();
                }
            });
            setTimeout(function(){
                document.querySelector("#messages").scrollTo(0, document.querySelector("#messages").scrollHeight);
            }, 2000);
        },
        statusCode: {
            404: function(data) {
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

function createMessage(userId, roomId, content) {
    return $.ajax({
        url: `${URLPath}/message`,
        type: "POST",
        data: {
            userId: userId,
            roomId: roomId,
            content: content
        },
        success: function(message) {
            return message.id;
        },
        statusCode: {
            400: function(data) {
                const errorMessage = data.responseJSON.message;
                alert(errorMessage);
            }
        }
    });
}

async function getUsername (userId) {
    return await
        $.ajax({
            url: `${URLPath}/user/${userId}`,
            type: "GET",
        })
            .then(function(user) {
                return user.username
            });
}

// Show all Participants of a Room
function showAllParticipantsOfARoom(roomId) {
    $(".users").empty();
    $.ajax({
        url: `${URLPath}/participant/roomId/${roomId}`,
        type: "GET",
        success: async function(participants) {
            for (let i = 0; i < participants.length; i++) {
                const username = await getUsername (participants[i].userId);
                const lis = document.getElementById("usersList").getElementsByTagName("li");
                let elementAlreadyListed = false;
                for (let j = 0; j < lis.length; j++) {
                    if (lis[j].id === participants[i].userId) {
                        elementAlreadyListed = true;
                    }
                }

                if (!elementAlreadyListed) {
                    $(".users").append(`
                       <li data-id="${participants[i].id}" id="${participants[i].userId}">${username}</li>
                    `);
                }
            }
        },
        statusCode: {
            404: function(data) {
                $(".users").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
            }
        }
    });
}

function createParticipantToRoom(userId, roomId) {
    $.ajax({
        url: `${URLPath}/participant/roomId/${roomId}`,
        type: "GET",
        success: function(participants) {
            let participantAlreadyExist = false;
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].userId === Number(userId)) {
                    participantAlreadyExist = true;
                    break;
                }
            }
            if (!participantAlreadyExist) {
                $.ajax({
                    url: `${URLPath}/participant`,
                    type: "POST",
                    data: {
                        userId: userId,
                        roomId: roomId
                    },
                    success: function() {
                        const socket = io();
                        socket.emit('chat participant');
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        },
        statusCode: {
            404: function(data) {
                const errorMsg = JSON.parse(data.responseText).Error;
                $.ajax({
                    url: `${URLPath}/participant`,
                    type: "POST",
                    data: {
                        userId: userId,
                        roomId: roomId
                    },
                    success: function() {
                        const socket = io();
                        socket.emit('chat participant');
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        }
    });
}

function deleteRoomParticipant (roomId, userId) {
    $.ajax({
        url: `${URLPath}/message/room/${roomId}`,
        type: "GET",
        success: function(messages) {
            let isFound = false;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].userId === Number(userId)) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                console.log("delete participant")
                const lis = document.getElementById("usersList").getElementsByTagName("li");
                for (let j = 0; j < lis.length; j++) {
                    if (lis[j].id === userId) {
                        let participantId = $(`#${userId}`).attr('data-id');
                        console.log(participantId);
                        $.ajax({
                            url: `${URLPath}/participant/${participantId}`,
                            type: "DELETE",
                            success: function() {
                                const socket = io();
                                socket.emit('chat participant');
                            },
                            statusCode: {
                                400: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                }
                            }
                        });
                    }
                }
            } else {
                console.log("the participant has more messages")
            }
        },
        statusCode: {
            404: function(data) {
                $(".users").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
            }
        }
    });
}