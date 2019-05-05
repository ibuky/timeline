const VtxUtil = {
  /**
   * sleep command like bash.
   * @param {Number} ms milisecond to sleep
   * @returns {Promise} resolve after sleeping
   */
  sleep: function(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  },

  /**
   * show alert popup without title
   * @param {String} message
   */
  showNoTitlePopup: (message) => ons.notification.alert({title:"",message:message}),
}