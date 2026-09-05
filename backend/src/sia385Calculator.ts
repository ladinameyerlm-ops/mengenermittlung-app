// SIA 385/1 Berechnungen (Trinkwasser)

export interface Verbrauchspunkte {
	anzahlWC: number;
	anzahlDuschen: number;
	anzahlSpülen: number;
	anzahlWaschtische?: number;
}

export interface BerechnetErgebnis {
	gesamtRohrlänge: number;
	gleichzeitigkeitsbeiwert: number;
	volumenstrom: number;
	speichervolumen: number;
	kosten: number;
	norm: string;
	konformität: boolean;
}

// SVGW W10: Gleichzeitigkeitsbeiwert
export function berechneGleichzeitigkeitsbeiwert(
	punkte: Verbrauchspunkte
): number {
	const gmax =
		punkte.anzahlWC * 0.3 +
		punkte.anzahlDuschen * 0.5 +
		punkte.anzahlSpülen * 0.2 +
		(punkte.anzahlWaschtische || 0) * 0.1;

	return Math.round(gmax * 100) / 100;
}

// SIA 385/1: Speicher-Volumen
export function speicherVolumenBerechnung(
	personenanzahl: number,
	komfortLevel: "standard" | "gehober" = "standard"
): number {
	const tagesbedarf = komfortLevel === "gehober" ? 50 : 35;
	const faktor = 0.3;
	return Math.round(personenanzahl * tagesbedarf * faktor);
}

// Materialkosten
export function materialKostenBerechnung(
	rohrlängen: { [key: string]: number },
	preiseProMeter: { [key: string]: number }
): number {
	let total = 0;
	for (const [key, länge] of Object.entries(rohrlängen)) {
		total += länge * (preiseProMeter[key] || 0);
	}
	return Math.round(total * 1.3);
}

// Hauptfunktion
export function berechneMenugenermittlung(input: {
	rohrlängen: { [key: string]: number };
	verbrauchspunkte: Verbrauchspunkte;
	personenanzahl: number;
	preiseDN: { [key: string]: number };
}): BerechnetErgebnis {
	const gmax = berechneGleichzeitigkeitsbeiwert(input.verbrauchspunkte);
	const speicher = speicherVolumenBerechnung(input.personenanzahl);
	const kosten = materialKostenBerechnung(input.rohrlängen, input.preiseDN);

	return {
		gesamtRohrlänge: Object.values(input.rohrlängen).reduce((a, b) => a + b, 0),
		gleichzeitigkeitsbeiwert: gmax,
		volumenstrom: gmax,
		speichervolumen: speicher,
		kosten,
		norm: "SIA 385/1 + SVGW W10",
		konformität: gmax > 0.5 && speicher > 0
	};
}
