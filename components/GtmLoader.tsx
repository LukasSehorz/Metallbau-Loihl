/*
 * Google Tag Manager — Container-ID im HTML, Ladevorgang trotzdem erst nach
 * Einwilligung.
 *
 * Zwei Anforderungen stoßen hier aufeinander:
 *
 *  1. Die Search Console verifiziert die Inhaberschaft, indem sie das
 *     ausgelieferte HTML der Startseite nach der Container-ID durchsucht. Ein
 *     Script, das erst zur Laufzeit per JavaScript eingefügt wird, steht dort
 *     nicht — die Prüfung scheitert dann mit "Container-ID nicht gefunden".
 *  2. Lädt der Container ungefragt, geht die IP jedes Besuchers an Google,
 *     bevor er zustimmen konnte.
 *
 * Deshalb steht das Snippet unverändert als Inline-Script im Dokument — die ID
 * ist im Quelltext auffindbar — aber es prüft vor dem Nachladen von gtm.js die
 * gespeicherte Einwilligung. Ohne Zustimmung passiert nichts; sie kann später
 * über das Banner nachgereicht werden, worauf das Script über das
 * Consent-Event startet.
 *
 * Das noscript-iframe des Standard-Snippets fehlt bewusst: Es lädt ohne
 * JavaScript, und ohne JavaScript kann niemand einwilligen.
 *
 * Bewusst eine Server-Komponente: Nur so landet das Script im initial
 * ausgelieferten HTML statt erst nach der Hydration.
 */

const GTM_ID = "GTM-PSSC758T";
const CONSENT_KEY = "loihl-consent-v1";
const CONSENT_EVENT = "loihl-consent-change";

const snippet = `
(function(w,d,s,l,i){
  function erlaubt(){
    try{
      var r=w.localStorage.getItem('${CONSENT_KEY}');
      return !!r && JSON.parse(r).statistik===true;
    }catch(e){return false;}
  }
  function start(){
    if(w.__loihlGtm)return; w.__loihlGtm=true;
    w[l]=w[l]||[];
    w[l].push({event:'consent_granted',ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  }
  w[l]=w[l]||[];
  w[l].push({event:'default_consent',ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  if(erlaubt())start();
  w.addEventListener('${CONSENT_EVENT}',function(e){
    if(e.detail&&e.detail.statistik)start();
  });
})(window,document,'script','dataLayer','${GTM_ID}');
`.trim();

export default function GtmLoader() {
  return (
    <script
      id="gtm-consent"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
