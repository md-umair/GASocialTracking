// Inspired from: https://code.google.com/p/analytics-api-samples/source/browse/trunk/src/tracking/javascript/v5/social/ga_social_tracking.js

/**
 * @fileoverview A simple script to automatically track Facebook and Twitter
 * buttons using Google Analytics social tracking feature.
 * @author info@nestor.cat (Néstor Malet)
 */


/**
 * Namespace.
 * @type {Object}.
 */
var socialTracking = socialTracking || {};

socialTracking.track = function(source, category, action){
  try{
    if(typeof(ga) != "undefined"){
      console.log('SocialTracking: ga.send');
      ga('send', 'social', source, category, action);
      ga('send', 'event', source, category, action);
    } else {
      console.log('SocialTracking: _gaq._track');
      _gaq.push(['_trackSocial', source, category, action]);
      _gaq.push(['_trackEvent', source, category, action]);
    }
  } catch (e) {
    console.log('SocialTracking: Google Analytics not set.');
  }
};



socialTracking.init = function(){
  socialTracking.oldOnLoad = window.onload;
  window.onload = function() {
    if(socialTracking.oldOnLoad){
      socialTracking.oldOnLoad();
    }
    socialTracking.run();
  };

  console.log('init');
};

socialTracking.run = function(){
  console.log('run');
  try{
    if (FB && FB.Event && FB.Event.subscribe) {
      FB.Event.subscribe('edge.create', function(opt_target) {
        socialTracking.track('facebook', 'like', opt_target);
      });
      FB.Event.subscribe('edge.remove', function(opt_target) {
        socialTracking.track('facebook', 'unlike', opt_target);
      });
      FB.Event.subscribe('message.send', function(opt_target) {
        socialTracking.track('facebook', 'send', opt_target);
      });
    }
  } catch (e) {
    console.log('SocialTracking: Facebook not detected.');
  }

  intent_handler_click = function(intent_event) {
    if (intent_event) {
      var opt_pagePath;
      if (intent_event.target && intent_event.target.nodeName == 'IFRAME') {
            opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
      }
      socialTracking.track('twitter', 'click', opt_pagePath);
    }
  };

  intent_handler_tweet = function(intent_event) {
    if (intent_event) {
      var opt_pagePath;
      if (intent_event.target && intent_event.target.nodeName == 'IFRAME') {
            opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
      }
      socialTracking.track('twitter', 'tweet', opt_pagePath);
    }
  };

  intent_handler_retweet = function(intent_event) {
    if (intent_event) {
      var opt_pagePath;
      if (intent_event.target && intent_event.target.nodeName == 'IFRAME') {
            opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
      }
      socialTracking.track('twitter', 'retweet', opt_pagePath);
    }
  };

  intent_handler_favorite = function(intent_event) {
    if (intent_event) {
      var opt_pagePath;
      if (intent_event.target && intent_event.target.nodeName == 'IFRAME') {
            opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
      }
      socialTracking.track('twitter', 'favorite', opt_pagePath);
    }
  };

  intent_handler_follow = function(intent_event) {
    if (intent_event) {
      var opt_pagePath;
      if (intent_event.target && intent_event.target.nodeName == 'IFRAME') {
            opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
      }
      socialTracking.track('twitter', 'follow', opt_pagePath);
    }
  };

  try{
    // bind twitter Click and Tweet events to Twitter tracking handler
    // Wait for the asynchronous resources to load
    twttr.ready(function (twttr) {
      // Now bind our custom intent events
      twttr.events.bind('click', intent_handler_click);
      twttr.events.bind('tweet', intent_handler_tweet);
      twttr.events.bind('retweet', intent_handler_retweet);
      twttr.events.bind('favorite', intent_handler_favorite);
      twttr.events.bind('follow', intent_handler_follow);
    });
  } catch (e) {
    console.log('SocialTracking: Twitter not detected.');
  }
};


/**
 * Handles tracking for Twitter click and tweet Intent Events which occur
 * everytime a user Tweets using a Tweet Button, clicks a Tweet Button, or
 * clicks a Tweet Count. This method should be binded to Twitter click and
 * tweet events and used as a callback function.
 * Details here: http://dev.twitter.com/docs/intents/events
 * @param {object} intent_event An object representing the Twitter Intent Event
 *     passed from the Tweet Button.
 * @param {string} opt_pagePath An optional URL to associate the social
 *     tracking with a particular page.
 * @private
 */
socialTracking.trackTwitterHandler_ = function(intent_event, opt_pagePath) {
  var opt_target; //Default value is undefined
  if (intent_event && intent_event.type == 'tweet' ||
          intent_event.type == 'click') {
    if (intent_event.target.nodeName == 'IFRAME') {
      opt_target = socialTracking.extractParamFromUri_(intent_event.target.src, 'url');
    }
    var socialAction = intent_event.type + ((intent_event.type == 'click') ?
        '-' + intent_event.region : ''); //append the type of click to action
    socialTracking.track('twitter', socialAction, opt_pagePath);
  }
};

/**
 * Binds Twitter Intent Events to a callback function that will handle
 * the social tracking for Google Analytics. This function should be called
 * once the Twitter widget.js file is loaded and ready.
 * @param {string} opt_pagePath An optional URL to associate the social
 *     tracking with a particular page.
 */
socialTracking.trackTwitter = function(opt_pagePath) {
  intent_handler = function(intent_event) {
    socialTracking.trackTwitterHandler_(intent_event, opt_pagePath);
  };


};


/**
 * Extracts a query parameter value from a URI.
 * @param {string} uri The URI from which to extract the parameter.
 * @param {string} paramName The name of the query paramater to extract.
 * @return {string} The un-encoded value of the query paramater. undefined
 *     if there is no URI parameter.
 * @private
 */
socialTracking.extractParamFromUri_ = function(uri, paramName) {
  if (!uri) {
    return;
  }
  var regex = new RegExp('[\\?&#]' + paramName + '=([^&#]*)');
  var params = regex.exec(uri);
  if (params != null) {
    return unescape(params[1]);
  }
  return;
};




socialTracking.init();