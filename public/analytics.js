/**
 * Website Upgraders Analytics Tracker
 * Embed in client websites:
 *   <script src="https://website-upgraders.vercel.app/analytics.js"
 *           data-client-id="CLIENT_UUID"></script>
 */
(function () {
  var el = document.currentScript;
  var CLIENT_ID = el && el.getAttribute("data-client-id");
  var API = (el && el.getAttribute("data-api")) || "https://website-upgraders.vercel.app/api/analytics/events";

  if (!CLIENT_ID) return;

  // Session ID — persists across page navigations within the same tab
  var SESSION_ID =
    sessionStorage.getItem("_wu_sid") ||
    "s_" + Math.random().toString(36).substring(2, 11);
  sessionStorage.setItem("_wu_sid", SESSION_ID);

  function send(eventType, props) {
    var payload = JSON.stringify({
      clientId: CLIENT_ID,
      sessionId: SESSION_ID,
      eventType: eventType,
      eventName: (props && props.eventName) || eventType,
      properties: props || {},
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon for reliability (fires even on page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API, payload);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", API, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(payload);
    }
  }

  // Track page view
  function trackPageView() {
    send("page_view", {
      page: location.pathname,
      title: document.title,
      referrer: document.referrer,
      url: location.href,
    });
  }

  // Track form submissions
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.tagName === "FORM") {
      send("form_submission", {
        formName: e.target.name || e.target.id || "unknown",
        page: location.pathname,
      });
    }
  });

  // Public API for custom events
  window.wuTrack = function (eventName, props) {
    send("custom", Object.assign({ eventName: eventName }, props || {}));
  };

  // Fire page view on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageView);
  } else {
    trackPageView();
  }
})();
