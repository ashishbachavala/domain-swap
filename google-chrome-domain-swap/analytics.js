// Lightweight Mixpanel tracking via HTTP API — avoids bundling the full SDK,
// which doesn't play well with Chrome Extension CSP and cookie restrictions.
(function () {
  var MIXPANEL_TOKEN = 'ce85e891be872d3aa4fea16a27ad7984';
  var MIXPANEL_API = 'https://api.mixpanel.com/track';

  var cachedDeviceId = null;

  async function getDeviceId() {
    if (cachedDeviceId) return cachedDeviceId;
    var result = await chrome.storage.local.get(['mp_device_id']);
    if (result.mp_device_id) {
      cachedDeviceId = result.mp_device_id;
    } else {
      cachedDeviceId = crypto.randomUUID();
      await chrome.storage.local.set({ mp_device_id: cachedDeviceId });
    }
    return cachedDeviceId;
  }

  window.mp = {
    track: async function (eventName, properties) {
      properties = properties || {};
      var deviceId = await getDeviceId();
      var payload = [{
        event: eventName,
        properties: Object.assign({}, properties, {
          token: MIXPANEL_TOKEN,
          distinct_id: deviceId,
          $device_id: deviceId,
          time: Math.floor(Date.now() / 1000),
          $insert_id: crypto.randomUUID(),
          mp_lib: 'chrome-extension',
          $app_version: chrome.runtime.getManifest().version,
        })
      }];

      try {
        await fetch(MIXPANEL_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' },
          body: JSON.stringify(payload),
        });
      } catch (_) {
        // Analytics should never break the extension
      }
    }
  };
})();
