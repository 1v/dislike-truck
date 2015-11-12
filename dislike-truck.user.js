// ==UserScript==
// @name            Фура с дизлайками
// @require         http://code.jquery.com/jquery-latest.min.js
// @require         https://apis.google.com/js/client.js
// @namespace       dislike-truck
// @description     Обращайтесь - https://github.com/1v/dislike-truck
// @include         /^https?:\/\/(www\.|)youtube\.com[/]+[\s\S]*$/
// @version         1.3
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
  console.log("Not a user page.");
  return true;
}

var CLIENT_ID = '595110168346-46igp17sotrer74ld1rbg4onc5smse60.apps.googleusercontent.com',
    API_KEY = 'AIzaSyByJQv-QxraMe7iNFEszkcnNk8JfPRTljY',
    SCOPES = 'https://www.googleapis.com/auth/youtube',
    PER_PAGE = 50,
    DELAY_TIME = 1000;

/**
* Authorize Google Youtube API.
*/
var auth = function(immediate, callback) {
  gapi.client.setApiKey(API_KEY);
  gapi.auth.authorize({
   client_id: CLIENT_ID,
   scope: SCOPES,
   immediate: immediate
  }, callback);
}

function authorization(callback) {
  auth(true, function(authResult) {
      console.log(authResult);
      if (authResult && !authResult.error) {
        // Authorization was successful. Hide authorization prompts and show
        // content that should be visible after authorization succeeds.
        loadAPIClientInterfaces(callback);
      } else {
        // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
        // client flow. The current function is called when that flow completes.
        auth(false, function(){
          loadAPIClientInterfaces(callback);
        });
      }
    });
}

function loadAPIClientInterfaces(callback) {
  gapi.client.load('youtube', 'v3', function() {
    typeof callback === 'function' && callback();
  });
}

appendUnloadingButton();

$(document).on("mouseover", function(){
  if ($(".unload-trucks").length < 1)
    appendUnloadingButton();
});

function appendUnloadingButton() {
  var button = $('<span style="float: left; margin-right: 5px;" class="channel-header-subscription-button-container yt-uix-button-subscription-container"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-subscribe-branded yt-uix-button-has-icon no-icon-markup yt-uix-subscription-button" type="button"><span class="yt-uix-button-content"><span class="subscribe-label">Подписаться</span></span></button></span>');
  $(".channel-header-subscription-button-container")
    .before(button.clone().addClass("register-loader").find(".subscribe-label").text("Регистрация").end())
    .before(button.clone().addClass("unload-trucks").find(".subscribe-label").text("Разгрузить фуры").end());
  // $(".channel-header-subscription-button-container")
  //   .before($("<button>").attr("class", "register-loader").text("Регистрация"))
  //   .before($("<button>").attr("class", "unload-trucks").text("Разгрузить фуры"));
}

function appendSimonov(add) {
  if ($(".simonov").length < 1 && add) {
    $(".register-loader")
      .before($("<img>").attr({"src": "//img-fotki.yandex.ru/get/9515/203537249.14/0_136180_483da1b3_orig.gif",
                                "class": "simonov"})
                        .css({"float": "left", "margin-right": "5px"}));
  } else {
    $(".simonov").remove();
  }
}

$(document).on("click", ".register-loader", function(){
  auth(false, loadAPIClientInterfaces(function(){
    requestChannelId(channelURI);
  }));
});

$(document).on("click", ".unload-trucks", function(){
  authorization(function(){
    requestChannelId(channelURI);
  });
});

function requestChannelId(user) {
  var request = gapi.client.youtube.channels.list({
    forUsername: user,
    part: "id"
  });

  request.execute(function(response) {
      appendSimonov(true);
      var str = response.result;
      requestPlaylistId(str.items[0].id);
  });
}

function requestPlaylistId(channelId) {
  var request = gapi.client.youtube.channels.list({
    id: channelId,
    part: "contentDetails"
  });

  request.execute(function(response) {
      var str = response.result;
      requestVideos(str.items[0].contentDetails.relatedPlaylists.uploads);
  });
}

// requesting videos from channel
// channelId -
function requestVideos(plId, responseObj) {
  var q = {
    playlistId: plId,
    maxResults: PER_PAGE,
    fields: "items/snippet/title,items/snippet/resourceId/videoId,nextPageToken,pageInfo",
    part: "snippet"
  };
  q.pageToken = (responseObj != null && responseObj.nextPageToken != null) ? responseObj.nextPageToken : null
  var request = gapi.client.youtube.playlistItems.list(q);

  request.execute(function(response) {
    proceedDislikes(plId, response);
  });
}

function proceedDislikes(channelId, responseObj) {

  for (i = 0; i < responseObj.items.length; i++) {
    var q = {
      id: responseObj.items[i].snippet.resourceId.videoId,
      rating: "dislike"
    };

    proceedSingleDislike(q, i, function(i){
                                   if (responseObj.nextPageToken == null &&
                                       (responseObj.items.length - 1) === i)
                                     appendSimonov(false);
                               });
  }

  if (responseObj != null && responseObj.nextPageToken != null) {
    setTimeout(function() {
      requestVideos(channelId, responseObj)
    }, DELAY_TIME * PER_PAGE);
  }
}

function proceedSingleDislike(query, delay, callback) {

  setTimeout(function(callback) {
    var request = gapi.client.youtube.videos.rate(query);
    request.execute(function(response) {
      return true;
    });
    typeof callback === 'function' && callback.call(this, delay);
  }, DELAY_TIME * delay, callback);

}

});
