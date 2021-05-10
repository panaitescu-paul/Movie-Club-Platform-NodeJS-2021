/**
* Helper Functions
*
* @authors  Paul Panaitescu, Constantin Razvan Tarau
* @version  1.0 29 APR 2021
*/
"use strict";
const URLPath = 'http://localhost:8000';

function clearModalData() {
    // Clear Modal Data from previous results
    $("#modalInfoContent1").empty();
    $("#modalInfoContent2").empty();
    $("#modalInfoContent3").empty();
    $("#modalInfoContent4").empty();
    $("#modalInfoContent5").empty();
    $("#modalInfoContent6").empty();
}

function showButtonCreate(button = 'None') {
    // Show a certain Button and hide the other buttons on the Admins page
    $('#btnCreateMovie').hide();
    $('#btnCreateCrew').hide();
    $('#btnCreateAdmin').hide();
    $('#btnCreateUser').hide();
    if (button == 'Movie') {
        $('#btnCreateMovie').show();
    } else if (button == 'Crew') {
        $('#btnCreateCrew').show();
    } else if (button == 'Admin') {
        $('#btnCreateAdmin').show();
    } else if (button == 'User') {
        $('#btnCreateUser').show();
    } else if (button == 'None') {
    }
}

function calculateRatingAverage(data) {
    // Calculate the Average Rating
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].value;
    }
    return sum/data.length;
}

function formatDate(date) {
    // TODO: add return for null case
    if (date == null) { 
        return 'Unknown';
    } else {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        
        return [year, month, day].join('-');
    }
}

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
    $(document).on('keypress',function(e) {
        if(e.which === 13) {
            $("#btnSearchCrew").click();
        }
    });
}

// Show all Crews in a List
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
function showAllAdmins(user = 'guest') {
    $("#results").empty();
    // TODO: To implement it
}

function checkAdminLogin(){
    $.ajax({
        url: `http://localhost:4000/admin`,
        type: "GET",
        success: function(response) {
            if (response !== 'Admin session available!') {
                window.location.href='../src/login.html';
            }
        }
    });
}

function checkMemberLogin(){
    $.ajax({
        url: `http://localhost:4000/member`,
        type: "GET",
        success: function(response) {
            console.log(response.member);
            if (response.message === 'Member session available!') {
                $('#memberLogout').show();
                $('#loginPageBtn').hide();
                $("#loginInfo").append(`
                    <span class="btn btn-success btn-custom1 mb-2 btnNav">Logged in as <b>${response.member.username}</b></span>
                `);
            } else {
                $('#memberLogout').hide();
                $('#loginPageBtn').show();
                $('#loginInfo').empty();
            }

        }
    });
}