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
    $('#btnCreateMember').hide();
    if (button == 'Movie') {
        $('#btnCreateMovie').show();
    } else if (button == 'Crew') {
        $('#btnCreateCrew').show();
    } else if (button == 'Admin') {
        $('#btnCreateAdmin').show();
    } else if (button == 'Member') {
        $('#btnCreateMember').show();
    } else if (button == 'None') {
    }
}

function showSearchType(type = 'None') {
    // Show a certain Button and hide the other buttons on the Admins page
    $('#movieSearch').hide();
    $('#crewSearch').hide();
    $('#adminSearch').hide();
    $('#memberSearch').hide();
    $(document).removeAttr("keypress");

    if (type == 'Movie') {
        $('#movieSearch').show();
        $(document).on('keypress',function(e) {
            if(e.which === 13) {
                $("#btnSearchMovie").click();
            }
        });
    } else if (type == 'Crew') {
        $('#crewSearch').show();
        $(document).on('keypress',function(e) {
            if(e.which === 13) {
                $("#btnSearchCrew").click();
            }
        });
    } else if (type == 'Admin') {
        $('#adminSearch').show();
        $(document).on('keypress',function(e) {
            if(e.which === 13) {
                $("#btnSearchAdmin").click();
            }
        });
    } else if (type == 'Member') {
        $('#memberSearch').show();
        $(document).on('keypress',function(e) {
            if(e.which === 13) {
                $("#btnSearchMember").click();
            }
        });
    } else if (type == 'None') {
    }
}

function calculateRatingAverage(data) {
    // Calculate the Average Rating
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].value;
    }
    return (sum/data.length).toFixed(2);
}

function formatDate(date) {
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

function formatDateTime(dateTime) {
    if (dateTime == null) {
        return 'Unknown';
    } else {
        let d = new Date(dateTime),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if (hours < 10)
            hours = '0' + hours;
        if (minutes < 10)
            minutes = '0' + minutes;
        if (seconds < 10)
            seconds = '0' + seconds;

        return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
    }
}

function checkAdminLogin(){
    $.ajax({
        url: `http://localhost:4000/admin`,
        type: "GET",
        success: function(response) {
            if (response.message !== 'Admin session available!') {
                $('#adminInfo').empty();
                window.location.href='../src/login.html';
            } else {
                $("#adminInfo").append(`
                    <span id="loggedInAdmin" data-id="${response.admin.id}" class="btn btn-success btn-custom1 mb-2 btnNav">Logged in as <b>${response.admin.username}</b></span>
                `);
            }
        }
    });
}

function checkMemberLogin(){
    $.ajax({
        url: `http://localhost:4000/member`,
        type: "GET",
        success: function(response) {
            if (response.message === 'Member session available!') {
                $('#memberLogout').show();
                $('#loginPageBtn').hide();
                $("#loginInfo").append(`
                    <span id="loggedInMember" data-id="${response.member.id}" class="btn btn-success btn-custom1 mb-2 btnNav">Logged in as <b>${response.member.username}</b></span>
                `);
            } else {
                $('#memberLogout').hide();
                $('#loginPageBtn').show();
                $('#loginInfo').empty();
            }
        }
    });
}

async function importHeaderFragment() {
    return await fetch("../src/header.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });
}

function importFooterFragment() {
    fetch("../src/footer.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });
}

function loginFormType() {
    $('#loginAdminForm').hide();
    $(document).on("click", "#btnMemberTab", function() {
        $("#loginTitle").text(`Member Login`);
        $('#loginMemberForm').show();
        $('#loginAdminForm').hide();
    });
    $(document).on("click", "#btnAdminTab", function() {
        $("#loginTitle").text(`Admin Login`);
        $('#loginMemberForm').hide();
        $('#loginAdminForm').show();
    });
}

function checkIfMemberLoggedIn() {
    $.ajax({
        url: `http://localhost:4000/member`,
        type: "GET",
        success: function(response) {
            if (response.message === 'Member session available!') {
                window.location.href='../src/movies.html';
            } else {
                $('#memberLogout').hide();
                $('#loginPageBtn').show();
                $('#loginInfo').empty();
            }
        }
    });
}

function checkIfAdminLoggedIn() {
    $.ajax({
        url: `http://localhost:4000/admin`,
        type: "GET",
        success: function(response) {
            if (response.message === 'Admin session available!') {
                window.location.href='../src/admins.html';
            }
        }
    });
}

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

// Rating stars functionality
function ratingStarsSelection() {
    const ratingStars = [...document.getElementsByClassName("rating__star")];
    const ratingResult = document.querySelector(".rating__result");
    const loggedInMemberId = $('#loggedInMember').attr("data-id");
    const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
    printRatingResult(ratingResult);

    function executeRating(stars, result) {
        const starClassActive = "rating__star fas fa-star";
        const starClassUnactive = "rating__star far fa-star";
        const starsLength = stars.length;
        let i;

        stars.map((star) => {

            star.onmouseover = () => {
                i = stars.indexOf(star);

                if (star.className.indexOf(starClassUnactive) !== -1) {
                    for (i; i >= 0; --i) stars[i].className = starClassActive;
                } else {
                    i = i + 1;
                    for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
                }
            };
            star.onmouseout = () => {
                showRatingStars(stars);
            }

            star.onclick = () => {
                i = stars.indexOf(star);

                if (loggedInMemberId === undefined) {
                    alert("You must be logged in to be able to leave a rating!");
                } else {
                    if (star.className.indexOf(starClassUnactive) !== -1) {
                        printRatingResult(result, i + 1);
                        for (i; i >= 0; --i) stars[i].className = starClassActive;
                    } else {
                        i = i + 1;
                        printRatingResult(result, i);
                        for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
                    }
                }
            };
        });

        showRatingStars(stars);
    }

    function printRatingResult(result, num = 0) {
        result.textContent = `${num}/10`;
    }

    function showRatingStars (stars) {
        $.ajax({
            url: `${URLPath}/rating/movie/${movieId}/user/${loggedInMemberId}`,
            type: "GET",
            success: function(rating) {
                if (rating.value === undefined) {
                    for (let i = 0; i < 10; i++) {
                        $(stars[i]).attr('class', 'rating__star far fa-star');
                    }
                } else {
                    for (let i = 0; i < rating.value; i++) {
                        $(stars[i]).attr('class', 'rating__star fas fa-star');
                    }

                    for (let i = 10; i >= rating.value; --i){
                        $(stars[i]).attr('class', 'rating__star far fa-star');
                    }
                }

                printRatingResult(ratingResult, rating.value);
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
    }

    executeRating(ratingStars, ratingResult);
}

function chatMessages(roomId, userId) {
    const socket = io();

    $("#message-form" ).on( "submit", function (e) {
        e.preventDefault();
        const memberUsername = $('#loggedInMember').text().substring(13);
        if (memberUsername === '') {
            alert("Guest users can't send messages! You must login as a member!");
        } else {
            let messageInput = $( "#message" ).val();
            if (messageInput) {
                createMessage(userId, roomId, messageInput).then(createdMessage => {
                    const messageId = createdMessage.id;
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = ("0" + (date.getMonth() + 1)).slice(-2);
                    let day = ("0" + date.getDate()).slice(-2);
                    let hours = ("0" + date.getHours()).slice(-2);
                    let minutes = ("0" + date.getMinutes()).slice(-2);
                    let seconds = ("0" + date.getSeconds()).slice(-2);
                    let createdAt = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                    socket.emit( 'chat message', { messageInput, createdAt, memberUsername, messageId } );
                    $( "#message" ).val( '' );
                });
            }
        }
    });

    socket.on('join', function (data) {
        console.log(data)
        const lis = document.getElementById("usersList").getElementsByTagName("li");
        let elementAlreadyListed = false;
        for (let i = 0; i < lis.length; i++) {
            if (lis[i].id === data.loggedInMemberId) {
                elementAlreadyListed = true;
            }
        }

        if (!elementAlreadyListed) {
            $(".users").append(`
               <li id="${data.loggedInMemberId}">${data.memberUsername}</li>
            `);
        }

    });

    socket.on('chat message', function (data) {
        $("#messages").append(`
           <div data-id="${data.messageId}" class="message">
                <p>
                    <span class="message__name">${data.memberUsername}</span>
                    <span class="message__meta"></span>
                </p>
                <p>${data.messageInput} <span id="createdAt">${formatDateTime(data.createdAt)}</span></p>
            </div>
        `);
        document.querySelector("#messages").scrollTo(0, document.querySelector("#messages").scrollHeight);
    });
}