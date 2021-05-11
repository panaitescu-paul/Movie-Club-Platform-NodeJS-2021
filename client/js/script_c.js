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
                $("#modalTitle").text(`${crew.name} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div>
                        <div class="card">
                            <img class="card-img-top" src="${crew.picture}">
                        </div>
                        <p id="name"><span class="tag">Name: </span><span class="tag-info">${crew.name}</span></p>
                        <p id="mainActivity"><span class="tag">Main Activity: </span><span class="tag-info">${crew.mainActivity}</span></p>
                        <p id="dateOfBirth"><span class="tag">Birthday: </span><span class="tag-info">${dateOfBirth}</span></p>
                        <p id="birthPlace"><span class="tag">Birth place: </span><span class="tag-info">${crew.birthPlace}</span></p>
                        <p id="biography"><span class="tag">Biography: </span><span class="tag-info">${crew.biography}</span></p>
                        <p id="website"><span class="tag">Website: </span><span class="tag-info">${crew.website}</span></p>
                        <p id="movies"><span class="tag">List of Movies: </span><div id="listOfMovies"></div></p>
                    </div>
                `);
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_arr) {
                        console.log(movie_crew_arr);
                        movie_crew_arr.forEach((movie_crew) => {
                            console.log(movie_crew.movieId + ' - ' + movie_crew.roleId)
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    console.log(movie.id);
                                    $.ajax({
                                        url: `${URLPath}/role/${movie_crew.roleId}`,
                                        type: "GET",
                                        success: function(role) {
                                            let releaseDate = formatDate(movie.releaseDate);
                                            $("#listOfMovies").append(`
                                                <div class="card">
                                                    <img data-id="${movie.id}" class="card-img-top poster" src="${movie.poster}"  data-toggle="modal" data-target="#modal">
                                                    <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                    <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                    <p id="role"><b>Role: </b>${role.name}</p>
                                                    <div class="card-body">
                                                        <button data-id="${movie.id}" type="button" class="btn btn-warning
                                                                btnShow showMovieModal" data-toggle="modal" data-target="#modal">Details</button>
                                                    </div>
                                                </div>
                                            `);
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
    $(document).on("click", "#btnSearchCrew", function() {
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
                        <p><b>${errorMessage}</b></p>
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
                <div class="form-group">
                    <label for="crewName">Crew Name</label>
                    <input type="text" class="form-control" id="crewName" required>
                </div>
                <div class="form-group">
                    <label for="crewMainActivity">Main Activity</label>
                    <input type="text" class="form-control" id="crewMainActivity">
                </div>
                <div class="form-group">
                    <label for="crewDateOfBirth">Date of Birth</label>
                    <input type="date" class="form-control" id="crewDateOfBirth">
                </div>
                <div class="form-group">
                    <label for="crewBirthPlace">Birth Place</label>
                    <input type="text" class="form-control" id="crewBirthPlace">
                </div>
                <div class="form-group">
                    <label for="crewBiography">Biography</label>
                    <textarea class="form-control" id="crewBiography" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="crewWebsite">Website</label>
                    <input type="text" class="form-control" id="crewWebsite">
                </div>
                
                <button type="submit" class="btn btn-primary">Add Crew</button>
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
                $("#modalInfoContent1").append(`
                    <form id="updateCrewForm">
                        <div class="form-group">
                            <label for="crewName">Crew Name</label>
                            <input type="text" class="form-control" id="crewName" value="${crew.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="crewMainActivity">Main Activity</label>
                            <input type="text" class="form-control" id="crewMainActivity" value="${crew.mainActivity}">
                        </div>
                        <div class="form-group">
                            <label for="crewDateOfBirth">Date of Birth</label>
                            <input type="date" class="form-control" id="crewDateOfBirth" value="${dateOfBirth}">
                        </div>
                        <div class="form-group">
                            <label for="crewBirthPlace">Birth Place</label>
                            <input type="text" class="form-control" id="crewBirthPlace" value="${crew.birthPlace}">
                        </div>
                        <div class="form-group">
                            <label for="crewBiography">Biography</label>
                            <textarea class="form-control" id="crewBiography" rows="3">${crew.biography}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="crewWebsite">Website</label>
                            <input type="text" class="form-control" id="crewWebsite" value="${crew.website}">
                        </div>
        
                        <button type="submit" class="btn btn-primary">Update Crew</button>
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
                console.log(data);
                $.ajax({
                    url: `http://localhost:4000/login/member`,
                    type: "POST",
                    data: {
                        username: data.memberUser.username,
                        password: data.memberUser.password,
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
                    console.log(data);
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
                        username: data.adminUser.username,
                        password: data.adminUser.password
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
                    console.log(data);
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

    // Admin logout button
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
                    <div>
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
    $(document).on("click", "#btnSearchAdmin", function() {
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
                        <p><b>${errorMessage}</b></p>
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
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password">
                </div>
                
                <button type="submit" class="btn btn-primary">Add Admin</button>
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
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" value="${admin.username}" required>
                        </div>
        
                        <button type="submit" class="btn btn-primary">Update Admin</button>
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
                        <img data-id="${crew.id}" class="card-img-top crewInfo poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                        <div class="card-body">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-body">
                            <button data-id="${crew.id}" type="button" class="btn btn-warning
                                    btnShow crewInfo detailsBtn" data-toggle="modal" data-target="#modal">See more details</button>
                        </div>
                    </div>
                `);
            });
            break;
        case 'member':
            data.forEach(crew => {
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#results").append(`
                    <div class="card crewDiv">
                        <img data-id="${crew.id}" class="card-img-top crewInfo poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                        <div class="card-body">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-body">
                            <div class="table-actions">
                            </div>
                            <button data-id="${crew.id}" type="button" class="btn btn-warning
                                    btnShow crewInfo detailsBtn" data-toggle="modal" data-target="#modal">See more details</button>
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
                        <img data-id="${crew.id}" class="card-img-top crewInfo poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                        <div class="card-body">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-body">
                            <div class="table-actions">
                            </div>
                            <button data-id="${crew.id}" type="button" class="btn btn-warning
                                    btnShow crewInfo" data-toggle="modal" data-target="#modal">Details</button>
                            <button data-id="${crew.id}" type="button" class="btn btn-primary
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

// Show Crews in a List
function showAdmins(data) {
    $("#results").empty();
    data.forEach(admin => {
        $("#results").append(`
            <div class="card adminDiv">
                <div class="card-body">
                    <h5 class="card-title">${admin.username}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Created at: </b>${formatDateTime(admin.createdAt)}</li>
                </ul>
                <div class="card-body">
                    <div class="table-actions">
                    </div>
                    <button data-id="${admin.id}" type="button" class="btn btn-warning
                            btnShow adminInfo" data-toggle="modal" data-target="#modal">Details</button>
                    <button data-id="${admin.id}" type="button" class="btn btn-primary
                            btnShow adminUpdate" data-toggle="modal" data-target="#modal">Update</button>
                    <button data-id="${admin.id}" type="button" class="btn btn-danger
                            btnShow adminDelete">Delete</button>
                </div>
            </div>
        `);
    });
}
