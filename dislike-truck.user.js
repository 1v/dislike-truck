// ==UserScript==
// @name            Фура с дизлайками
// @require         http://code.jquery.com/jquery-latest.min.js
// @require         https://apis.google.com/js/client.js
// @namespace       dislike-truck
// @description     Обращайтесь - https://github.com/1v/dislike-truck
// @include         /^https?:\/\/(www\.|)youtube\.com[/]+[\s\S]*$/
// @version         1.1
// @author          1v
// @grant           none
// @icon            http://img-fotki.yandex.ru/get/17846/203537249.14/0_1356dd_5dfe78f0_orig.png
// @updateURL       https://github.com/1v/dislike-truck/raw/master/dislike-truck.user.js
// @downloadURL     https://github.com/1v/dislike-truck/raw/master/dislike-truck.user.js
// @run-at          document-end
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

var CLIENT_ID = '595110168346-46igp17sotrer74ld1rbg4onc5smse60.apps.googleusercontent.com',
    API_KEY = 'AIzaSyByJQv-QxraMe7iNFEszkcnNk8JfPRTljY',
    SCOPES = 'https://www.googleapis.com/auth/youtube',
    PER_PAGE = 10,
    DELAY_TIME = 1000;

/**
* Authorize Google Youtube API.
*/
function authorization() {
 gapi.client.setApiKey(API_KEY);
 gapi.auth.authorize({
   client_id: CLIENT_ID,
   scope: SCOPES,
   immediate: true
 }, function(authResult) {
      if (authResult && !authResult.error) {
        // Authorization was successful. Hide authorization prompts and show
        // content that should be visible after authorization succeeds.
        $('.pre-auth').hide();
        $('.post-auth').show();

        loadAPIClientInterfaces();
      } else {
        // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
        // client flow. The current function is called when that flow completes.
        $('#login-link').click(function() {
          gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: false
            }, handleAuthResult);
        });
      }
    }
 );
}

/**
* Driver for sample application.
*/
$(window).load(authorization);

function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    // search();
  });
}

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

function requestChannelId(user) {
  var request = gapi.client.youtube.channels.list({
    forUsername: user,
    part: "id"
  });

  request.execute(function(response) {
      var str = response.result;
      requestVideos(str.items[0].id);
  });
}

// requesting videos from channel
// channelId -
function requestVideos(channelId, responseObj = null) {
  var q = {
    channelId: channelId,
    maxResults: PER_PAGE,
    order: "date",
    type: "video",
    part: "id"
  };
  q.pageToken = (responseObj != null && responseObj.nextPageToken != null) ? responseObj.nextPageToken : null
  var request = gapi.client.youtube.search.list(q);

  request.execute(function(response) {
    proceedDislikes(channelId, response);
  });
}

function proceedDislikes(channelId, responseObj) {

  for (i = 0; i < responseObj.items.length; i++) {
    var q = {
      id: responseObj.items[i].id.videoId,
      rating: "dislike"
    };

    proceedSingleDislike(q, i);
  }

  if (responseObj != null && responseObj.nextPageToken != null) {
    setTimeout(function() {
      requestVideos(channelId, responseObj)
    }, DELAY_TIME * PER_PAGE);
  }
}

function proceedSingleDislike(query, delay) {

  setTimeout(function() {
    var request = gapi.client.youtube.videos.rate(query);
    request.execute(function(response) {
      return true;
    });
  }, DELAY_TIME * delay);

}

});
