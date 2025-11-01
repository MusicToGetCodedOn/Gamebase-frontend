import React from "react";
import "./ImpressumModal.css";

export default function ImpressumModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="impressum-overlay" onClick={onClose}>
      <div className="impressum-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="impressum-content">
          <h1>Impressum</h1>
          <p>
            <strong>Loris Pérez</strong><br />
            Lorrainestrasse 1b<br />
            03013 Bern<br />
            Tel: +41 123 45 67<br />
            <a href="mailto:loris.perez@proton.me">loris.perez@proton.me</a>
          </p>

          <h1>Disclaimer - rechtliche Hinweise</h1>
          <h2>Auskunfts- und Widerrufsrecht</h2>
          <p>
            Sie haben jederzeit das Recht, sich unentgeltlich und unverzüglich über die zu Ihrer Person erhobenen
            Daten zu erkundigen. Ebenfalls können Sie Ihre Zustimmung zur Verwendung Ihrer angegebenen
            personenbezogenen Daten mit Wirkung für die Zukunft widerrufen. Hierfür wenden Sie sich bitte an
            den im Impressum angegebenen Diensteanbieter.
          </p>

          <h2>Datenschutz (allgemein)</h2>
          <p>
            Beim Zugriff auf unsere Webseite werden automatisch allgemeine Informationen (sog. Server-Logfiles)
            erfasst. Diese beinhalten u.a. den von Ihnen verwendeten Webbrowser sowie Ihr Betriebssystem und
            Ihren Internet Service Provider. Diese Daten lassen keinerlei Rückschlüsse auf Ihre Person zu und
            werden von uns statistisch ausgewertet, um unseren Internetauftritt technisch und inhaltlich zu
            verbessern. Das Erfassen dieser Informationen ist notwendig, um den Inhalt der Webseite korrekt
            ausliefern zu können.
          </p>

          <p>
            Die Nutzung der Webseite ist grundsätzlich ohne Angabe personenbezogener Daten möglich. Soweit
            personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt
            dies stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an
            Dritte weitergegeben.
          </p>

          <p>
            Sofern ein Vertragsverhältnis begründet, inhaltlich ausgestaltet oder geändert werden soll oder Sie
            an uns eine Anfrage stellen, erheben und verwenden wir personenbezogene Daten von Ihnen, soweit dies
            zu diesem Zwecke erforderlich ist (Bestandsdaten).
          </p>

          <h2>Disclaimer (Haftungsausschluss)</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
            zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>

          <p>
            Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte kein Einfluss
            genommen werden kann. Deshalb kann für diese fremden Inhalte auch keine Gewähr übernommen werden.
          </p>

          <p>
            Die durch die Diensteanbieter erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
            Urheberrecht. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
            Gebrauch gestattet.
          </p>

          <p className="impressum-generator">
            Dieses Impressum wurde mit Hilfe des{" "}
            <a
              href="http://www.hensche.de/impressum-generator.html"
              target="_blank"
              rel="noreferrer"
            >
              Impressum-Generators
            </a>{" "}
            von{" "}
            <a
              href="http://www.hensche.de/Rechtsanwalt_Arbeitsrecht_Berlin.html"
              target="_blank"
              rel="noreferrer"
            >
              HENSCHE Rechtsanwälte
            </a>{" "}
            erstellt.
          </p>
        </div>
      </div>
    </div>
  );
}
