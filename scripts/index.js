// Global Variables
var HEADER_ROW = 2;
var RATINGS_STARTING_ROW = 3;
var RATING_COLUMN_COUNT = 3;


// Get data from goole sheets
function makeApiCall() {
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1ZwYgrpV0BrPkWbbnTdD1csZ2HoYGvWwkMY7po3YZXnI',  // TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        range: 'BCB Reviews',  // TODO: Update placeholder value.

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        //valueRenderOption: '',  // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        //dateTimeRenderOption: '',  // TODO: Update placeholder value.
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function (response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);

        createRatingTable(response.result);

    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function initClient() {
    var API_KEY = $("#APIKEY").val();  // TODO: Update placeholder with desired API key.

    var CLIENT_ID = $("#CLIENTID").val();  // TODO: Update placeholder with desired client ID.

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        //updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        makeApiCall();
    })
    ;
}


//Not using yet

//function handleClientLoad() {
//    gapi.load('client', initClient);
//}

//function updateSignInStatus(isSignedIn) {
//  if (isSignedIn) {
//    makeApiCall();
//  }
//}

//function handleSignInClick(event) {
//  gapi.auth2.getAuthInstance().signIn();
//}

//function handleSignOutClick(event) {
//  gapi.auth2.getAuthInstance().signOut();
//}

// Use DATA from API to build up ratings table
function createRatingTable(result) {
    var tableData,
        tableHeader,
        tableBody;

    tableData = '<table class="table table-bordered table-striped" >';

    // Table header
    tableHeader = '<thead>'
                    + '<tr>'
                        + '<th>' + result.values[HEADER_ROW][0] + '</th>'
                        + '<th>' + result.values[HEADER_ROW][1] + '</th>'
                        + '<th>' + result.values[HEADER_ROW][result.values[HEADER_ROW].length - 1] + '</th>'
                    + '</tr>'
                + '</thead>';

    // Table Body
    tableBody = '<tbody>';
    for (var row = RATINGS_STARTING_ROW; row < result.values.length; row++) {
        tableBody = tableBody + '<tr>';
        for (var col = 0; col < RATING_COLUMN_COUNT; col++) {
            if (col == 0) { // Rank
                tableBody = tableBody + '<th>' + result.values[row][col] + '</td>';
            }
            else if (col == 1) { // Name
                tableBody = tableBody + '<td>' + result.values[row][col] + '</td>';
            }
            else { // Rating (in the last row element)
                tableBody = tableBody + '<td>' + result.values[row][result.values[row].length - 1];
            }
        }
        tableBody = tableBody + '</tr>';
    }

    // Build up table and append
    tableData = tableData + tableHeader + tableBody + '</table>';
    $('#divRatings').append(tableData);
}

/*
    Event bindings
*/
$(document).ready(function () {
    $("#getReviewData").click(function () {
        if ($("#APIKEY").val() != "" && $("#CLIENTID").val() != "") {
            gapi.load('client', initClient);
        }
        else {
            alert("Failed");
        }
    });
});