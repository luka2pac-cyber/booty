/**
 * Booty Builder — avviso prenotazioni.
 * Va incollato in Google Apps Script con l'account di Alessia.
 * A ogni prenotazione: crea l'evento nel calendario e manda una email semplice.
 * Se la prenotazione viene annullata, toglie l'evento dal calendario.
 */
var PROGETTO = 'booty-builder-65217';
var CHIAVE = 'AIzaSyAWphlte1rpYqTibJlAaZKY4PktfSIGl1A';
var DURATA_MINUTI = 60;
var FUSO = 'Europe/Rome';
var GIORNI = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
var MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

function doPost(e) {
  var out = { ok: false };
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var req = JSON.parse(e.postData.contents);
    var id = String(req.id || '').replace(/[^A-Za-z0-9_-]/g, '');
    if (!id) throw new Error('id mancante');
    var props = PropertiesService.getScriptProperties();
    var fascia = leggiFascia(id);
    var salvato = props.getProperty('ev_' + id);

    if (fascia && fascia.stato === 'occupata' && fascia.nome) {
      if (!salvato) {
        var inizio = Utilities.parseDate(fascia.data + ' ' + fascia.ora, FUSO, 'yyyy-MM-dd HH:mm');
        var fine = new Date(inizio.getTime() + DURATA_MINUTI * 60000);
        var ev = CalendarApp.getDefaultCalendar().createEvent(fascia.nome, inizio, fine,
          { description: 'Presentazione scheda Booty Builder' });
        props.setProperty('ev_' + id, ev.getId());
        var p = fascia.data.split('-');
        var g = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        var quando = GIORNI[g.getDay()] + ' ' + Number(p[2]) + ' ' + MESI[Number(p[1]) - 1] + ' alle ' + fascia.ora;
        MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
          'Prenotazione scheda: ' + fascia.nome + ' — ' + quando,
          fascia.nome + ' ha prenotato la presentazione della scheda.\n\n' +
          'Quando: ' + quando + '\n\n' +
          "L'appuntamento è già nel tuo Google Calendar.");
      }
      out.ok = true;
    } else {
      if (salvato) {
        try { var vecchio = CalendarApp.getEventById(salvato); if (vecchio) vecchio.deleteEvent(); } catch (err) {}
        props.deleteProperty('ev_' + id);
      }
      out.ok = true;
    }
  } catch (err) {
    out.errore = String(err);
  } finally {
    try { lock.releaseLock(); } catch (err2) {}
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function leggiFascia(id) {
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROGETTO +
    '/databases/(default)/documents/prenotazioni/' + id + '?key=' + CHIAVE;
  var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (r.getResponseCode() === 404) return null;
  if (r.getResponseCode() !== 200) throw new Error('Firestore ' + r.getResponseCode());
  var f = JSON.parse(r.getContentText()).fields || {};
  function s(k) { return f[k] && f[k].stringValue ? f[k].stringValue : ''; }
  return { data: s('data'), ora: s('ora'), stato: s('stato'), nome: s('nome') };
}

/** Da eseguire UNA volta a mano: fa comparire la richiesta di autorizzazione. */
function autorizza() {
  CalendarApp.getDefaultCalendar().getName();
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true });
  Logger.log('Autorizzazione completata per ' + Session.getEffectiveUser().getEmail());
}
