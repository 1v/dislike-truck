// ==UserScript==
// @name            Фура с дизлайками
// @require         http://code.jquery.com/jquery-latest.min.js
// @require         https://apis.google.com/js/client.js
// @namespace       dislike-truck
// @description     Обращайтесь - http://rutracker.org/forum/profile.php?mode=viewprofile&u=4516607
// @include         /^https?:\/\/(www\.|)youtube\.com[/]+[\s\S]*$/
// @version         1.0
// @grant           none
// @icon            http://img-fotki.yandex.ru/get/17846/203537249.14/0_1356dd_5dfe78f0_orig.png
// @updateURL       https://gist.github.com/1v/5335ecade4e8c423b8c9/raw/f53ad5f6506d8000c00bed56e07236883705564e/dislike-truck.user.js
// ==/UserScript==

$(function() {

var re = /youtube\.com\/user\/([^\/]+)/,
    m;

if ((m = re.exec(window.location.href)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    var channelURI = m[1];
} else {
  console.log("Not user page.");
  return true;
}

var CLIENT_ID = '595110168346-46igp17sotrer74ld1rbg4onc5smse60.apps.googleusercontent.com';
var API_KEY = 'AIzaSyByJQv-QxraMe7iNFEszkcnNk8JfPRTljY';
var SCOPES = 'https://www.googleapis.com/auth/youtube';

/**
* Authorize Google Youtube API.
*/
function authorization() {
 gapi.client.setApiKey(API_KEY);
 gapi.auth.authorize({
   client_id: CLIENT_ID,
   scope: SCOPES,
   immediate: false
 }, function(authResult) {
      if (authResult && !authResult.error) {
        loadAPIClientInterfaces();
      } else {
        window.alert("Auth was not successful");
      }
    }
 );
}

/**
* Driver for sample application.
*/
$(window).load(authorization);

appendUnloadingButton();

$(document).on("mouseover", function(){
  if ($(".unload-trucks").length < 1)
    appendUnloadingButton();
});

function appendUnloadingButton() {
  $(".channel-header-subscription-button-container").before($("<button>").attr("class", "unload-trucks").text("Разгрузить фуры"));
}

$(document).on("click", ".unload-trucks", function(){
  requestChannelId(channelURI);
});

function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    // search();
  });
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: "Сергей Симонов",
    type: "channel",
    part: 'snippet'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $("body").prepend('<pre>' + str + '</pre>');
  });
}

function requestChannelId(user) {
  var request = gapi.client.youtube.channels.list({
    forUsername: user,
    part: "id"
  });

  request.execute(function(response) {
      var str = response.result;
      return str.items[0].id;
  });
}

});
