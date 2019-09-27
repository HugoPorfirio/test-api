function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

var searchNextPage = undefined;
var searchText = undefined;

$(function() {
    $("form").on("submit", function(e) {

       e.preventDefault();

        searchText = $("#search").val();
        searchNextPage = undefined;
        searchVideos(searchText, function(response) {
          var results = response.result;
          $("#results").html("");
          if( typeof results == "undefined" ) {
            $("#results").append($("<p>").text("Nenhum vídeo encontrado."));
            return;
          }
          console.log(results);
          searchNextPage = results.nextPageToken;
          $.each(results.items, function(index, item) {
            console.log(item);
            $.get("tpl/item.html", function(data) {
                $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          resetVideoHeight();
       });

       // // prepare the request
       // var requestParams = {
       //      part: "snippet",
       //      type: "video",
       //      q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
       //      maxResults: 3,
       //      order: "viewCount",
       //      publishedAfter: "2019-01-01T00:00:00Z"
       // };
       // if( typeof searchNextPage != "undefined" ) {
       //    requestParams.pageToken = searchNextPage;
       // }
       // var request = gapi.client.youtube.search.list(requestParams); 
       // // execute the request
       // request.execute(function(response) {
       //    var results = response.result;
       //    $("#results").html("");
       //    if( typeof results == "undefined" ) {
       //      $("#results").append($("<p>").text("Nenhum vídeo encontrado."));
       //      return;
       //    }
       //    console.log(results);
       //    searchNextPage = results.nextPageToken;
       //    $.each(results.items, function(index, item) {
       //      console.log(item);
       //      $.get("tpl/item.html", function(data) {
       //          $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
       //      });
       //    });
       //    resetVideoHeight();
       // });
    });
    
    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

$(window).scroll(function() { //evento de scroll na janela
    if($(window).scrollTop() == $(document).height() - $(window).height()) { //atingido o final da página
        if( typeof searchText == "undefined") { return; }

        searchVideos(searchText, function(response) {
          var results = response.result;
          if( typeof results == "undefined" ) {
            return;
          }
          searchNextPage = results.nextPageToken;
          $.each(results.items, function(index, item) {
            console.log(item);
            $.get("tpl/item.html", function(data) {
                $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          resetVideoHeight();
       });
        
    }
});


function searchVideos(text, callback) {
  var requestParams = {
            part: "snippet",
            type: "video",
            q: encodeURIComponent(text).replace(/%20/g, "+"),
            maxResults: 3,
            order: "viewCount",
            publishedAfter: "2019-01-01T00:00:00Z"
       };
       if( typeof searchNextPage != "undefined" ) {
          requestParams.pageToken = searchNextPage;
       }
       var request = gapi.client.youtube.search.list(requestParams); 
       // execute the request
       request.execute(callback);
  };

function init() {
    gapi.client.setApiKey("AIzaSyCjeEEma0cbser-fUg1gX007ejv1Tz4ATA");
    gapi.client.load("youtube", "v3", function(){
      // yt api is ready
      console.log("carregou");
    });
        
} 

