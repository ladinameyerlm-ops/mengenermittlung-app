import React, { useState } from 'react';
import './App.css';

interface Verbrauchspunkte {
  anzahlWC: number;
  anzahlDuschen: number;
  anzahlSpülen: number;
  anzahlWaschtische: number;
}

interface ErgebnisseProps {
  gmaxKaltwasser: number;
  gmaxWarmwasser: number;
  speichervolumen: number;
  kostenKaltwasser: number;
  kostenWarmwasser: number;
  kostenZirkulation: number;
  kostenGesamt: number;
  norm: string;
}

function App() {
  // Verbrauchspunkte
  const [anzahlWC, setAnzahlWC] = useState(2);
  const [anzahlDuschen, setAnzahlDuschen] = useState(1);
  const [anzahlSpülen, setAnzahlSpülen] = useState(1);
  const [anzahlWaschtische, setAnzahlWaschtische] = useState(2);
  const [personenanzahl, setPersonenanzahl] = useState(4);

  // Kaltwasser - Verteilleitung
  const [kwVerteilDN20, setKwVerteilDN20] = useState(30);
  const [kwVerteilDN25, setKwVerteilDN25] = useState(20);
  const [kwVerteilDN32, setKwVerteilDN32] = useState(10);

  // Kaltwasser - Steigzone
  const [kwSteigDN20, setKwSteigDN20] = useState(15);
  const [kwSteigDN25, setKwSteigDN25] = useState(10);
  const [kwSteigDN32, setKwSteigDN32] = useState(5);

  // Warmwasser - Verteilleitung
  const [wwVerteilDN20, setWwVerteilDN20] = useState(25);
  const [wwVerteilDN25, setWwVerteilDN25] = useState(15);
  const [wwVerteilDN32, setWwVerteilDN32] = useState(8);

  // Warmwasser - Steigzone
  const [wwSteigDN20, setWwSteigDN20] = useState(12);
  const [wwSteigDN25, setWwSteigDN25] = useState(8);
  const [wwSteigDN32, setWwSteigDN32] = useState(4);

  // Zirkulation - Rohre
  const [zirkChromstahl, setZirkChromstahl] = useState(50);
  const [zirkVepD16, setZirkVepD16] = useState(30);
  const [zirkVepD12, setZirkVepD12] = useState(20);

  // Zirkulation - Komponenten
  const [anzahlSträng, setAnzahlSträng] = useState(2);

  // Preise Kaltwasser
  const [kwPreisDN20, setKwPreisDN20] = useState(10);
  const [kwPreisDN25, setKwPreisDN25] = useState(14);
  const [kwPreisDN32, setKwPreisDN32] = useState(18);

  // Preise Warmwasser
  const [wwPreisDN20, setWwPreisDN20] = useState(10);
  const [wwPreisDN25, setWwPreisDN25] = useState(14);
  const [wwPreisDN32, setWwPreisDN32] = useState(18);

  // Preise Zirkulation
  const [zirkPreisChromstahl, setZirkPreisChromstahl] = useState(8);
  const [zirkPreisVepD16, setZirkPreisVepD16] = useState(3.5);
  const [zirkPreisVepD12, setZirkPreisVepD12] = useState(2.5);

  const [ergebnisse, setErgebnisse] = useState<ErgebnisseProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // SVGW W3 Beiwerte
  const berechneGmaxKaltwasser = () => {
    return (
      anzahlWC * 0.1 +
      anzahlDuschen * 0.2 +
      anzahlSpülen * 0.3 +
      anzahlWaschtische * 0.1
    );
  };

  const berechneGmaxWarmwasser = () => {
    return (
      anzahlDuschen * 0.2 +
      anzahlSpülen * 0.2 +
      anzahlWaschtische * 0.1
    );
  };

  const berechneSpeichervolumen = () => {
    return Math.round(personenanzahl * 35 * 0.3);
  };

  const berechneKosten = async () => {
    setLoading(true);
    setError('');

    try {
      const gmaxKW = berechneGmaxKaltwasser();
      const gmaxWW = berechneGmaxWarmwasser();
      const speicher = berechneSpeichervolumen();

      // Kaltwasser-Kosten (mit 1.3 Aufschlag)
      const kostenKwVerteil =
        (kwVerteilDN20 * kwPreisDN20 +
          kwVerteilDN25 * kwPreisDN25 +
          kwVerteilDN32 * kwPreisDN32) *
        1.3;
      const kostenKwSteig =
        (kwSteigDN20 * kwPreisDN20 +
          kwSteigDN25 * kwPreisDN25 +
          kwSteigDN32 * kwPreisDN32) *
        1.3;
      const kostenKW = kostenKwVerteil + kostenKwSteig;

      // Warmwasser-Kosten (mit 1.3 Aufschlag)
      const kostenWwVerteil =
        (wwVerteilDN20 * wwPreisDN20 +
          wwVerteilDN25 * wwPreisDN25 +
          wwVerteilDN32 * wwPreisDN32) *
        1.3;
      const kostenWwSteig =
        (wwSteigDN20 * wwPreisDN20 +
          wwSteigDN25 * wwPreisDN25 +
          wwSteigDN32 * wwPreisDN32) *
        1.3;
      const kostenWW = kostenWwVerteil + kostenWwSteig;

      // Zirkulation-Kosten (mit 1.3 Aufschlag)
      const kostenZirkRohre =
        (zirkChromstahl * zirkPreisChromstahl +
          zirkVepD16 * zirkPreisVepD16 +
          zirkVepD12 * zirkPreisVepD12) *
        1.3;
      const kostenZirkPumpe = 500;
      const kostenZirkVentil = 50;
      const kostenZirkRegVentile = anzahlSträng * 100;
      const kostenZirkulation =
        kostenZirkRohre + kostenZirkPumpe + kostenZirkVentil + kostenZirkRegVentile;

      const kostenGesamt = kostenKW + kostenWW + kostenZirkulation;

      setErgebnisse({
        gmaxKaltwasser: Math.round(gmaxKW * 100) / 100,
        gmaxWarmwasser: Math.round(gmaxWW * 100) / 100,
        speichervolumen: speicher,
        kostenKaltwasser: Math.round(kostenKW),
        kostenWarmwasser: Math.round(kostenWW),
        kostenZirkulation: Math.round(kostenZirkulation),
        kostenGesamt: Math.round(kostenGesamt),
        norm: 'SVGW W3 - Schweizer Norm für Hausinstallationen',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Regler + Input-Feld kombiniert
  const RohrleitungInput = ({
    label,
    value,
    onChange,
    preis,
    onPreisChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    preis: number;
    onPreisChange: (val: number) => void;
  }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-row">
        <input
          type="range"
          min="0"
          max="200"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-field"
          placeholder="m"
        />
        <span className="unit">m</span>
      </div>
      <div className="price-row">
        <label>Preis CHF/m:</label>
        <input
          type="number"
          value={preis}
          onChange={(e) => onPreisChange(Number(e.target.value))}
          className="input-field-small"
          step="0.1"
        />
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏗️ Mengenermittlungs-App SIA 385/1</h1>
        <p>SVGW W3 - Trinkwasser-Hausinstallationen (Schweiz)</p>
      </header>

      <main className="container">
        <section className="form-section">
          <h2>📋 Verbrauchspunkte (SVGW W3)</h2>

          <div className="form-group">
            <label className="label-large">WC (0.1 l/s Kaltwasser)</label>
            <div className="value-display">{anzahlWC}</div>
            <input
              type="range"
              min="0"
              max="10"
              value={anzahlWC}
              onChange={(e) => setAnzahlWC(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="label-large">Dusche (0.2 l/s KW + 0.2 l/s WW)</label>
            <div className="value-display">{anzahlDuschen}</div>
            <input
              type="range"
              min="0"
              max="10"
              value={anzahlDuschen}
              onChange={(e) => setAnzahlDuschen(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="label-large">Spüle (0.3 l/s KW + 0.2 l/s WW)</label>
            <div className="value-display">{anzahlSpülen}</div>
            <input
              type="range"
              min="0"
              max="10"
              value={anzahlSpülen}
              onChange={(e) => setAnzahlSpülen(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="label-large">Waschtisch (0.1 l/s KW + 0.1 l/s WW)</label>
            <div className="value-display">{anzahlWaschtische}</div>
            <input
              type="range"
              min="0"
              max="10"
              value={anzahlWaschtische}
              onChange={(e) => setAnzahlWaschtische(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="label-large">Personenanzahl</label>
            <div className="value-display">{personenanzahl}</div>
            <input
              type="range"
              min="1"
              max="20"
              value={personenanzahl}
              onChange={(e) => setPersonenanzahl(Number(e.target.value))}
            />
          </div>

          <hr />

          <h3>❄️ KALTWASSER - UG Verteilleitung (Chromstahl 1.4401)</h3>

          <RohrleitungInput
            label="DN20"
            value={kwVerteilDN20}
            onChange={setKwVerteilDN20}
            preis={kwPreisDN20}
            onPreisChange={setKwPreisDN20}
          />

          <RohrleitungInput
            label="DN25"
            value={kwVerteilDN25}
            onChange={setKwVerteilDN25}
            preis={kwPreisDN25}
            onPreisChange={setKwPreisDN25}
          />

          <RohrleitungInput
            label="DN32"
            value={kwVerteilDN32}
            onChange={setKwVerteilDN32}
            preis={kwPreisDN32}
            onPreisChange={setKwPreisDN32}
          />

          <h3>❄️ KALTWASSER - Steigzone (Chromstahl 1.4401)</h3>

          <RohrleitungInput
            label="DN20"
            value={kwSteigDN20}
            onChange={setKwSteigDN20}
            preis={kwPreisDN20}
            onPreisChange={setKwPreisDN20}
          />

          <RohrleitungInput
            label="DN25"
            value={kwSteigDN25}
            onChange={setKwSteigDN25}
            preis={kwPreisDN25}
            onPreisChange={setKwPreisDN25}
          />

          <RohrleitungInput
            label="DN32"
            value={kwSteigDN32}
            onChange={setKwSteigDN32}
            preis={kwPreisDN32}
            onPreisChange={setKwPreisDN32}
          />

          <hr />

          <h3>🔥 WARMWASSER - UG Verteilleitung (Chromstahl 1.4401)</h3>

          <RohrleitungInput
            label="DN20"
            value={wwVerteilDN20}
            onChange={setWwVerteilDN20}
            preis={wwPreisDN20}
            onPreisChange={setWwPreisDN20}
          />

          <RohrleitungInput
            label="DN25"
            value={wwVerteilDN25}
            onChange={setWwVerteilDN25}
            preis={wwPreisDN25}
            onPreisChange={setWwPreisDN25}
          />

          <RohrleitungInput
            label="DN32"
            value={wwVerteilDN32}
            onChange={setWwVerteilDN32}
            preis={wwPreisDN32}
            onPreisChange={setWwPreisDN32}
          />

          <h3>🔥 WARMWASSER - Steigzone (Chromstahl 1.4401)</h3>

          <RohrleitungInput
            label="DN20"
            value={wwSteigDN20}
            onChange={setWwSteigDN20}
            preis={wwPreisDN20}
            onPreisChange={setWwPreisDN20}
          />

          <RohrleitungInput
            label="DN25"
            value={wwSteigDN25}
            onChange={setWwSteigDN25}
            preis={wwPreisDN25}
            onPreisChange={setWwPreisDN25}
          />

          <RohrleitungInput
            label="DN32"
            value={wwSteigDN32}
            onChange={setWwSteigDN32}
            preis={wwPreisDN32}
            onPreisChange={setWwPreisDN32}
          />

          <hr />

          <h3>♻️ ZIRKULATION - Rohre</h3>

          <RohrleitungInput
            label="Chromstahl 1.4401 DN12"
            value={zirkChromstahl}
            onChange={setZirkChromstahl}
            preis={zirkPreisChromstahl}
            onPreisChange={setZirkPreisChromstahl}
          />

          <RohrleitungInput
            label="VEP Optiflex d16"
            value={zirkVepD16}
            onChange={setZirkVepD16}
            preis={zirkPreisVepD16}
            onPreisChange={setZirkPreisVepD16}
          />

          <RohrleitungInput
            label="VEP Optiflex d12"
            value={zirkVepD12}
            onChange={setZirkVepD12}
            preis={zirkPreisVepD12}
            onPreisChange={setZirkPreisVepD12}
          />

          <h3>♻️ ZIRKULATION - Komponenten</h3>

          <div className="form-group">
            <label className="label-large">Anzahl Stränge (für thermische Regulierventile)</label>
            <div className="value-display">{anzahlSträng}</div>
            <input
              type="range"
              min="1"
              max="10"
              value={anzahlSträng}
              onChange={(e) => setAnzahlSträng(Number(e.target.value))}
            />
            <small>Pro Strang: 1x Thermisches Regulierventil à 100 CHF</small>
          </div>

          <div className="info-box">
            <p>
              <strong>Zirkulations-Kosten:</strong>
            </p>
            <ul>
              <li>Zirkulations-Pumpe: 1x 500 CHF</li>
              <li>Rückschlagventil: 1x 50 CHF</li>
              <li>Thermische Regulierventile: {anzahlSträng}x 100 CHF</li>
            </ul>
          </div>

          <button
            className="btn-berechne"
            onClick={berechneKosten}
            disabled={loading}
          >
            {loading ? '⏳ Berechnet...' : '🔢 BERECHNEN'}
          </button>

          {error && <div className="error">{error}</div>}
        </section>

        {ergebnisse && (
          <section className="results-section">
            <h2>📊 Mengenermittlung - Ergebnisse</h2>

            <div className="result-grid">
              <div className="result-card">
                <h3>gmax Kaltwasser (l/s)</h3>
                <p className="result-value">
                  {ergebnisse.gmaxKaltwasser.toFixed(2)}
                </p>
              </div>

              <div className="result-card">
                <h3>gmax Warmwasser (l/s)</h3>
                <p className="result-value">
                  {ergebnisse.gmaxWarmwasser.toFixed(2)}
                </p>
              </div>

              <div className="result-card">
                <h3>Speichervolumen WW (l)</h3>
                <p className="result-value">
                  {ergebnisse.speichervolumen}
                </p>
              </div>

              <div className="result-card">
                <h3>Kosten Kaltwasser (CHF)</h3>
                <p className="result-value">
                  {ergebnisse.kostenKaltwasser.toLocaleString('de-CH')}
                </p>
              </div>

              <div className="result-card">
                <h3>Kosten Warmwasser (CHF)</h3>
                <p className="result-value">
                  {ergebnisse.kostenWarmwasser.toLocaleString('de-CH')}
                </p>
              </div>

              <div className="result-card">
                <h3>Kosten Zirkulation (CHF)</h3>
                <p className="result-value">
                  {ergebnisse.kostenZirkulation.toLocaleString('de-CH')}
                </p>
              </div>
            </div>

            <div className="result-card-large">
              <h3>💰 GESAMTKOSTEN (CHF)</h3>
              <p className="result-value-large">
                CHF {ergebnisse.kostenGesamt.toLocaleString('de-CH')}
              </p>
            </div>

            <div className="info-box">
              <p>
                <strong>Norm:</strong> {ergebnisse.norm}
              </p>
              <p>
                <strong>Hinweis:</strong> Alle Rohrlängen-Kosten enthalten
                30% Aufschlag für Fittinge.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;