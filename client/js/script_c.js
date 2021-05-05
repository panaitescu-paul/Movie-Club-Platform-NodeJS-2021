$(document).ready(function() {
    const URLPath = 'http://localhost:8000';

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
                        <p id="name"><b>Name: </b>${crew.name}</p>
                        <p id="mainActivity"><b>Main Activity: </b>${crew.mainActivity}</p>
                        <p id="dateOfBirth"><b>Birthday: </b>${dateOfBirth}</p>
                        <p id="birthPlace"><b>Birth place: </b>${crew.birthPlace}</p>
                        <p id="biography"><b>Biography: </b>${crew.biography}</p>
                        <p id="website"><b>Website: </b>${crew.website}</p>
                        <p id="movies"><b>List of Movies: </b><div id="listOfMovies"></div></p>
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
                                                <div class="card movieInfo" data-id="${movie.id}">
                                                    <img class="card-img-top poster" src="${movie.overview}">
                                                    <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                    <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                    <p id="role"><b>Role: </b>${role.name}</p>
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

    $(document).on("click", "#btnSearchCrew", function() {
        const searchValue = $('#searchCrew').val();
        $.ajax({
            url: `${URLPath}/crew/name/search?name=${searchValue}`,
            type: "GET",
            success: function(crews) {
                showCrews(crews);
            },
            statusCode: {
                404: function() {
                    $("#results").empty().append(`
                        <p><b>This person does not exist in the database!</b></p>
                    `);
                }
            }
        });
    });

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
                            $('#btnCrewTab').click();
                            setTimeout(function(){
                                $('.scrollDown').click();
                            }, 2000);
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = JSON.parse(data.responseText).Error;
                                alert(data.responseJSON.message + ' ' + data.responseJSON.error);
                            },
                            409: function(data) {
                                const errorMessage = JSON.parse(data.responseText).Error;
                                alert(errorMessage);
                            }
                        }
                    });
                }
            });
        });
    });

    $(document).on("click", ".crewUpdate", function() {
        const crewId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                // if(crew.picture === null || crew.picture === '') {
                //     crew.picture = "../img/notFoundPicture.jpg";
                // }
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
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
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
                            $('#btnCrewTab').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = JSON.parse(data.responseText).Error;
                                alert(data.responseJSON.message + ' ' + data.responseJSON.error);
                            },
                            409: function(data) {
                                const errorMessage = JSON.parse(data.responseText).Error;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    $(document).on("click", ".crewDelete", function() {
        const crewId = $(this).attr("data-id");
        console.log(crewId)
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
                        const errorMessage = JSON.parse(data.responseText).Error;
                        alert(errorMessage);
                    }
                }
            });
        }

    });
});