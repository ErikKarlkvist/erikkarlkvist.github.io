/**
 * OSA-backend för bröllopssidan (Google Apps Script).
 *
 * SHEET: en enda flik som heter "Gäster", rad 1 = rubriker, exakt dessa (gemener):
 *
 *   namn            | familj                                                      | vigsel | rundvandring | brollop | kor_bil | allergier | meddelande | tid
 *   Erik Karlkvist  | Eli Knoph, Erik Karlkvist                                   |        |         |         |           |            |
 *   Eli Knoph       | Eli Knoph, Erik Karlkvist                                   |        |         |         |           |            |
 *   Peter Karlkvist | Peter Karlkvist, Barbro Karlkvist, Linnéa Karlkvist, ...     |        |         |         |           |            |
 *
 * "familj" = kommaseparerade namn på alla i hushållet (inklusive personen själv).
 * vigsel / brollop fylls i av sidan med JA eller NEJ. rundvandring ingår numera i
 * middagen och frågas inte längre separat, men kolumnen finns kvar för manuell koll.
 * kor_bil = JA om de kommer med bil, annars NEJ.
 * Tomt = har inte svarat än.
 *
 * DISTRIBUERA
 *   Tillägg → Apps Script → klistra in → Spara
 *   Distribuera → Ny distribution → Webbapp → Kör som: Jag, Åtkomst: Alla
 *   Kopiera /exec-URL:en och klistra in i sidans Tweaks-fält "API-URL".
 *
 * CSV: Arkiv → Ladda ner → Kommaavgränsade värden.
 */

var KOLUMNER = ['namn', 'familj', 'vigsel', 'rundvandring', 'brollop', 'kor_bil', 'allergier', 'meddelande', 'tid'];
var FLIK = 'Gäster';

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function norm_(s) {
  return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
}

function table_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(FLIK) || ss.getSheets()[0];
  if (!sh) throw new Error('Hittar ingen flik i kalkylarket');
  var values = sh.getDataRange().getValues();
  var head = values[0].map(norm_);
  var idx = {};
  KOLUMNER.forEach(function (c) { idx[c] = head.indexOf(c); });
  return { sh: sh, values: values, idx: idx };
}

function cell_(t, row, col) {
  var i = t.idx[col];
  return i < 0 ? '' : t.values[row][i];
}

function person_(t, row) {
  return {
    namn: String(cell_(t, row, 'namn')).trim(),
    vigsel: norm_(cell_(t, row, 'vigsel')) === 'ja',
    rundvandring: norm_(cell_(t, row, 'rundvandring')) === 'ja',
    brollop: norm_(cell_(t, row, 'brollop')) === 'ja',
    kor_bil: String(cell_(t, row, 'kor_bil') || ''),
    allergier: String(cell_(t, row, 'allergier') || ''),
    svarat: String(cell_(t, row, 'tid') || '') !== ''
  };
}

/** GET ?action=lookup&namn=Erik Karlkvist */
function doGet(e) {
  try {
    var key = norm_(e.parameter.namn);
    if (!key) return json_({ ok: false, error: 'namn saknas' });

    var t = table_();
    var rowIndex = -1;
    for (var i = 1; i < t.values.length; i++) {
      if (norm_(cell_(t, i, 'namn')) === key) { rowIndex = i; break; }
    }
    if (rowIndex < 0) return json_({ ok: true, found: false, familj: [], meddelande: '' });

    var namnILista = String(cell_(t, rowIndex, 'familj') || cell_(t, rowIndex, 'namn'))
      .split(',').map(function (s) { return s.trim(); }).filter(String);

    var familj = namnILista.map(function (n) {
      for (var j = 1; j < t.values.length; j++) {
        if (norm_(cell_(t, j, 'namn')) === norm_(n)) return person_(t, j);
      }
      return { namn: n, vigsel: false, rundvandring: false, brollop: false, kor_bil: '', allergier: '', svarat: false };
    });

    return json_({
      ok: true,
      found: true,
      namn: String(cell_(t, rowIndex, 'namn')).trim(),
      familj: familj,
      meddelande: String(cell_(t, rowIndex, 'meddelande') || ''),
      harSvarat: familj.some(function (p) { return p.svarat; })
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** POST { avsandare, meddelande, personer: [{namn, vigsel, brollop, kor_bil, allergier}] } */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var t = table_();
    var nu = new Date();
    var skrivna = 0;

    (data.personer || []).forEach(function (p) {
      for (var i = 1; i < t.values.length; i++) {
        if (norm_(cell_(t, i, 'namn')) !== norm_(p.namn)) continue;
        var set = function (col, val) {
          if (t.idx[col] >= 0) t.sh.getRange(i + 1, t.idx[col] + 1).setValue(val);
        };
        set('vigsel', p.vigsel ? 'JA' : 'NEJ');
        set('rundvandring', p.rundvandring ? 'JA' : 'NEJ');
        set('brollop', p.brollop ? 'JA' : 'NEJ');
        set('kor_bil', p.kor_bil === true ? 'JA' : (p.kor_bil === false || p.kor_bil == null ? 'NEJ' : String(p.kor_bil)));
        set('allergier', p.allergier || '');
        set('tid', nu);
        if (norm_(p.namn) === norm_(data.avsandare)) set('meddelande', data.meddelande || '');
        skrivna++;
        break;
      }
    });

    return json_({ ok: true, skrivna: skrivna });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
