//author @mlnck
if (!window.console) { window.console = {}; }
if (!window.qonsole) { window.qonsole = {}; }
//global settings pseudo-constants
qonsole.GLOBAL_SETTINGS_UPDATED = { setLogLevel: false, showGroups: false, debugCalled: false };
qonsole.GLOBAL_SETTINGS_ERROR_MESSAGE = 'Global settings (`setLogLevel`,`showGroups`) may only be applied once and must be applied before any other Qonsole calls.';
qonsole.GLOBAL_SETTINGS_ERROR = false;
qonsole.BROWSER_URL_OVERRIDE = 0;
qonsole.BROWSER_URL_OVERRIDE_MESSAGE = 'This feature is not to be used for development debugging. ' +
  'It is meant for those cases when the code is live and a bug is noticed. ' +
  'By using this you will lose many of the customization and helping options ' +
  'And will more than likely introduce unwanted behavior if using it during the normal debugging process.';
//log level pseudo-constants
qonsole.DEBUG = 'CONSOLE_DEBUG_LOG_DEBUG';
qonsole.NORM = 'CONSOLE_DEBUG_LOG_NORMAL';
qonsole.PROD = 'CONSOLE_DEBUG_LOG_PRODUCTION';
//type pseudo-constants
qonsole.INFO = 'CONSOLE_DEBUG_INFO';
qonsole.ERROR = 'CONSOLE_DEBUG_ERROR';
qonsole.WARN = 'CONSOLE_DEBUG_WARN';
qonsole.DO_PROFILE = false;
//user defined pseudo-constants
qonsole.GROUPS = {};

qonsole.handleGlobalSettingsError = function() {
  qonsole.GLOBAL_SETTINGS_ERROR = true;
  console.error(qonsole.GLOBAL_SETTINGS_ERROR_MESSAGE);
  return false;
}
qonsole.setLogLevel = function(s) {
  if (qonsole.GLOBAL_SETTINGS_UPDATED.setLogLevel) { qonsole.handleGlobalSettingsError(); return false; }
  qonsole.GLOBAL_SETTINGS_UPDATED.setLogLevel = true;
  this.logLevel = (s === qonsole.NORM) ? qonsole.NORM : (s === qonsole.PROD) ? qonsole.PROD : qonsole.DEBUG;
}
qonsole.showGroups = function(a) {
  if (qonsole.GLOBAL_SETTINGS_UPDATED.showGroups) { qonsole.handleGlobalSettingsError(); return false; }
  //ADD TO README
  //Groups can only be toggled in the settings - all toggled off, then individually turned back on
  //if showGroups is used, default mode is automatically set to PROD
  qonsole.GLOBAL_SETTINGS_UPDATED.showGroups = true;
  this.logLevel = qonsole.PROD;
  a.map((itm, indx) => { qonsole.GROUPS[itm] = itm; });
}
qonsole.isLevel = function(s) {
  this.OVERRIDE_GLOBAL = (s === qonsole.NORM) ? qonsole.NORM : (s === qonsole.PROD) ? qonsole.PROD : qonsole.DEBUG;
  return this;
}
qonsole.setGroup = function(s, ss = '') {
  if (qonsole.GROUPS.hasOwnProperty(s)) { this.OVERRIDE_GLOBAL = (ss === qonsole.NORM) ? qonsole.NORM : qonsole.DEBUG }
  return this;
}
qonsole.browserOverride = function() {
  console.warn('!!! BROWSER OVERRIDE WARNING ↴');
  console.info(qonsole.BROWSER_URL_OVERRIDE_MESSAGE);
  console.warn('!!! BROWSER OVERRIDE WARNING ↑');
  qonsole.BROWSER_URL_OVERRIDE = (~window.location.href.indexOf('qonsole-normal')) ? 1 : 2;
}
qonsole.debug = function(...args) {
  //stop script if there is an error
  if (qonsole.GLOBAL_SETTINGS_ERROR) { return false; }
  //ensures global settings are set before anything else
  qonsole.GLOBAL_SETTINGS_UPDATED.showGroups = true;
  qonsole.GLOBAL_SETTINGS_UPDATED.setLogLevel = true;

  if (qonsole.DO_PROFILE) { console.profile('debug profile'); } //Not fully supported + Increases Load Time Drastically
  console.time('debugged in');

  if (qonsole.logLevel && qonsole.logLevel != qonsole.DEBUG) { args.splice(0, 0, qonsole.logLevel); }
  if (qonsole.OVERRIDE_GLOBAL) {
    if (this.logLevel) { args.splice(0, 1); } args.splice(0, 0, qonsole.OVERRIDE_GLOBAL);
    delete qonsole.OVERRIDE_GLOBAL;
  }

  if (qonsole.BROWSER_URL_OVERRIDE) { this.logLevel = (qonsole.BROWSER_URL_OVERRIDE === 1) ? qonsole.NORM : qonsole.DEBUG; }

  let debugType, settingOffset = 0;
  switch (args[0]) {
    case 'CONSOLE_DEBUG_INFO':
      debugType = 'info';
      break;
    case 'CONSOLE_DEBUG_ERROR':
      debugType = 'error';
      break;
    case 'CONSOLE_DEBUG_WARN':
      debugType = 'warn';
      break;
    case 'CONSOLE_DEBUG_LOG_PRODUCTION':
      return false;
    case 'CONSOLE_DEBUG_LOG_NORMAL':
      debugType = checkTypeFromSettings(args[1]);
      // if(debugType === 'err'){ debugType = 'error'; }
      (debugType === 'log') ? args.splice(0, 1): args.splice(0, 2);
      console[debugType](args);
      return;
    case 'CONSOLE_DEBUG_LOG_DEBUG':
      args.splice(0, 1);
      debugType = checkTypeFromSettings(args[0]);
      break;
    default:
      debugType = 'log';
  }

  console.count(`--START DEBUG BLOCK--${debugType}`);
  // console.timeStamp('started at'); //Not fully supported
  for (let i = 0; i < args.length; i++) {
    if (~String(args[i]).indexOf('CONSOLE_DEBUG_')) { settingOffset++; continue; } //catchall to remove debug settings from being logged
    let itemStr = (i + (1 - settingOffset)) + ') ';
    if (typeof(args[i]) === 'string' && args[i].charAt(args[i].length - 1) === ':') { console[debugType](itemStr, args[i], args[++i]); } else {
      // console.log(debugType);
      console[debugType](itemStr, args[i]);
    }
    checkForObject(itemStr, args[i]);
  }
  console.groupCollapsed('Stack Trace: & --END DEBUG BLOCK--');
  console.trace();
  console.groupEnd();
  // console.timeEnd('debugged in');
  // console.log('--END DEBUG BLOCK--');
  console.log('');
  // console.log('');
  if (qonsole.DO_PROFILE) { console.profileEnd('debug profile'); } //Not fully supported + Increases Load Time Drastically
  function checkForObject(s, o) {
    if (typeof(o) === 'object') { console[debugType]('Tabular data for item ' + s.replace(')', '') + '↴'); }
    formatOutput(o);
  }

  function formatOutput(o, title = '') {
    if (typeof(o) !== 'object') { return false; }
    let nest = [],
      grpTitle = (+title) ? 'view table from item ' + title + ' above' : 'view root table'
    nest.push(o);
    console.groupCollapsed(grpTitle);
    console.table(nest);
    console.groupEnd();
    if (Array.isArray(o)) {
      o.forEach(function(itm, indx) {
        if (typeof(o) === 'object') { formatOutput(itm, indx); }
      });
    }
    if (~String(o.constructor).indexOf('Object')) {
      let indx = 0;
      for (let k in o) { if (typeof(o[k]) === 'object') { formatOutput(o[k], indx); } indx++; }
    }
  }

  function checkTypeFromSettings(s) {
    return (~String(s).indexOf('CONSOLE_DEBUG_')) ? s.replace('CONSOLE_DEBUG_', '').toLowerCase() : 'log';
  }
};
if (~window.location.href.indexOf('qonsole-debug')) { qonsole.browserOverride(); }
