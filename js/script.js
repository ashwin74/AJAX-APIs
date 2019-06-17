function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    
    //API 1 - Street View Static API
    var $street = $('#street').val();
    var $city = $('#city').val();
    var address = $street +", "+$city;
    
    $greeting.text("So you want to Look in "+address);
    
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load google streetview background image:
    var streetViewUrl= "https://maps.googleapis.com/maps/api/streetview?size=600x400&location="+address+"&key=AIzaSyDQdFc070-SzGVBuDAKQLqfDQNRSOZQLlI";
    
    $body.append('<img class="bgimg" src ="'+streetViewUrl+'">'); 
    

    //API-2- NYT Article Search API + AJAX Requests
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+$city+"&sort=newest&api-key=wZrxpWPdvHJds05LH4fVxum0kbH7IPdi"

    $.getJSON( nytimesUrl, function( data ) {
        $nytHeaderElem.text("New York Times Articles about "+$city);

        var articles = data.response.docs;
        for(var i=0; i<articles.length;i++) {
            var article = articles[i];
            $nytElem.append(
                '<li class="article">'+
                    '<a href="'+article.web_url+'">'+
                    article.headline.main+
                    '</a>'+
                    '<p>'+article.snippet+'</p>'+
                '</li>'
                );
        }
      }).error(function() {
        $nytHeaderElem.text("New York Times Could Not Be Loaded");
      });


      //API-3-Wikipedia Articles API
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + $city + '&format=json&callback=wikiCallback';
      
      var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia Resources");
      }, 8000);
      
      $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        success: function(response) {
            var articleList = response[1];
            for(var i=0;i<articleList.length;i++) {
                articleStr=articleList[i];
                var url = 'http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append(
                    '<li><a href="'+url+'">'+articleStr+'</a></li>'
                    )
            };

            clearTimeout(wikiRequestTimeout);
            
        }
      });


    return false;
};

// On clicking submit button loadData() is called.
$('#form-container').submit(loadData);  