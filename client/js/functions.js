/**
* Helper Functions
*
* @authors  Paul Panaitescu, Constantin Razvan Tarau
* @version  1.0 29 APR 2021
*/
"use strict";

function clearModalData() {
    // Clear Modal Data from previous results
    $("#modalInfoContent1").empty();
    $("#modalInfoContent2").empty();
    $("#modalInfoContent3").empty();
    $("#modalInfoContent4").empty();
    $("#modalInfoContent5").empty();
    $("#modalInfoContent6").empty();
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

// Show all Crews in a List
function showAllCrews(user = 'guest') {
    $.ajax({
        url: `${URL}crew`,
        type: "GET",
        success: function(crews) {
            showCrews(crews);
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
    data.forEach(crew => {
        if(crew.picture === null || crew.picture === '') {
            crew.picture = "../img/notFoundPicture.jpg";
        }
        $("#results").append(`
            <div class="card crewInfo" data-id="${crew.id}">
                <img class="card-img-top poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                <div class="card-body">
                    <h5 class="card-title">${crew.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                </ul>
            </div>
        `);
    });
}