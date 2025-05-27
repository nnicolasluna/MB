export interface UTM {
	easting: number;
	northing: number;
	zoneNumber: number;
	zoneLetter: string;
}

/**
 * Code rewrite from https://github.com/shahid28/utm-latlng/blob/master/UTMLatLng.js
 * Review the results of the implementation, the results may not be accurate, check the original paper for more information
 * Original paper: https://www.mygeodesy.id.au/documents/A%20fresh%20look%20at%20the%20UTM%20projection%20-%20the%20Karney-Krueger%20equations%20V2.pdf
 * */
export class UTMToLatLng {
	private datumName: string = 'WGS 84';
	private a: number = 0;
	private eccSquared: number = 0;
	private status: boolean = false;

	constructor(datumNameIn?: string) {
		if (datumNameIn) {
			this.datumName = datumNameIn;
		}
		this.setEllipsoid(this.datumName);
	}

	convertLatLngToUtm(latitude: number, longitude: number, precision: number): UTM | null {
		if (this.status) return null;
		if (!Number.isInteger(precision)) return null;

		latitude = parseFloat(latitude.toString());
		longitude = parseFloat(longitude.toString());

		let zoneNumber: number;

		if (longitude >= 8 && longitude <= 13 && latitude > 54.5 && latitude < 58) {
			zoneNumber = 32;
		} else if (latitude >= 56.0 && latitude < 64.0 && longitude >= 3.0 && longitude < 12.0) {
			zoneNumber = 32;
		} else {
			zoneNumber = (Math.floor((longitude + 180) / 6) + 1) % 60;

			if (latitude >= 72.0 && latitude < 84.0) {
				if (longitude >= 0.0 && longitude < 9.0) zoneNumber = 31;
				else if (longitude >= 9.0 && longitude < 21.0) zoneNumber = 33;
				else if (longitude >= 21.0 && longitude < 33.0) zoneNumber = 35;
				else if (longitude >= 33.0 && longitude < 42.0) zoneNumber = 37;
			}
		}

		const LongOrigin = (zoneNumber - 1) * 6 - 180 + 3;
		const LongOriginRad = this.toRadians(LongOrigin);
		const LatRad = this.toRadians(latitude);
		const LongRad = this.toRadians(longitude);

		const UTMZone = this.getUtmLetterDesignator(latitude);
		const eccPrimeSquared = this.eccSquared / (1 - this.eccSquared);

		const N = this.a / Math.sqrt(1 - this.eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
		const T = Math.tan(LatRad) ** 2;
		const C = eccPrimeSquared * Math.cos(LatRad) ** 2;
		const A = Math.cos(LatRad) * (LongRad - LongOriginRad);

		const M =
			this.a *
			((1 - this.eccSquared / 4 - (3 * this.eccSquared ** 2) / 64 - (5 * this.eccSquared ** 3) / 256) * LatRad -
				((3 * this.eccSquared) / 8 + (3 * this.eccSquared ** 2) / 32 + (45 * this.eccSquared ** 3) / 1024) *
					Math.sin(2 * LatRad) +
				(15 * this.eccSquared ** 2) / 256 +
				((45 * this.eccSquared ** 3) / 1024) * Math.sin(4 * LatRad) -
				((35 * this.eccSquared ** 3) / 3072) * Math.sin(6 * LatRad));

		let UTMEasting =
			0.9996 *
				N *
				(A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2 + 72 * C - 58 * eccPrimeSquared) * A ** 5) / 120) +
			500000.0;

		let UTMNorthing =
			0.9996 *
			(M +
				N *
					Math.tan(LatRad) *
					(A ** 2 / 2 +
						((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
						((61 - 58 * T + T ** 2 + 600 * C - 330 * eccPrimeSquared) * A ** 6) / 720));

		if (latitude == 0) UTMNorthing = 0;
		if (latitude < 0) UTMNorthing += 10000000.0;

		UTMEasting = this.precisionRound(UTMEasting, precision);
		UTMNorthing = this.precisionRound(UTMNorthing, precision);

		return {
			easting: UTMEasting,
			northing: UTMNorthing,
			zoneNumber,
			zoneLetter: UTMZone,
		};
	}

	convertUtmToLatLng(
		UTMEasting: number,
		UTMNorthing: number,
		UTMZoneNumber: number,
		UTMZoneLetter: string,
	): { lat: number; lng: number } | null {
		if (!UTMEasting || !UTMNorthing || !UTMZoneNumber || !UTMZoneLetter) {
			return null;
		}

		const e1 = (1 - Math.sqrt(1 - this.eccSquared)) / (1 + Math.sqrt(1 - this.eccSquared));
		let x = UTMEasting - 500000.0;
		let y = UTMNorthing;

		const NorthernHemisphere = ['N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(UTMZoneLetter)
			? 1
			: 0;

		if (!NorthernHemisphere) y -= 10000000.0;

		const LongOrigin = (UTMZoneNumber - 1) * 6 - 180 + 3;
		const eccPrimeSquared = this.eccSquared / (1 - this.eccSquared);

		const M = y / 0.9996;
		const mu =
			M / (this.a * (1 - this.eccSquared / 4 - (3 * this.eccSquared ** 2) / 64 - (5 * this.eccSquared ** 3) / 256));

		const phi1Rad =
			mu +
			((3 * e1) / 2 - (27 * e1 ** 3) / 32) * Math.sin(2 * mu) +
			((21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32) * Math.sin(4 * mu) +
			((151 * e1 ** 3) / 96) * Math.sin(6 * mu);

		// const phi1 = this.toDegrees(phi1Rad);
		const N1 = this.a / Math.sqrt(1 - this.eccSquared * Math.sin(phi1Rad) ** 2);
		const T1 = Math.tan(phi1Rad) ** 2;
		const C1 = eccPrimeSquared * Math.cos(phi1Rad) ** 2;
		const R1 = (this.a * (1 - this.eccSquared)) / Math.pow(1 - this.eccSquared * Math.sin(phi1Rad) ** 2, 1.5);
		const D = x / (N1 * 0.9996);

		const Lat =
			phi1Rad -
			((N1 * Math.tan(phi1Rad)) / R1) *
				(D ** 2 / 2 -
					((5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * eccPrimeSquared) * D ** 4) / 24 +
					((61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * eccPrimeSquared - 3 * C1 ** 2) * D ** 6) / 720);

		const Long =
			LongOrigin +
			this.toDegrees(
				D -
					((1 + 2 * T1 + C1) * D ** 3) / 6 +
					((5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * eccPrimeSquared + 24 * T1 ** 2) * D ** 5) / 120,
			);

		return { lat: this.toDegrees(Lat), lng: this.toDegrees(Long) };
	}

	getUtmLetterDesignator(latitude: number): string {
		if (84 >= latitude && latitude >= 72) return 'X';
		else if (72 > latitude && latitude >= 64) return 'W';
		else if (64 > latitude && latitude >= 56) return 'V';
		else if (56 > latitude && latitude >= 48) return 'U';
		else if (48 > latitude && latitude >= 40) return 'T';
		else if (40 > latitude && latitude >= 32) return 'S';
		else if (32 > latitude && latitude >= 24) return 'R';
		else if (24 > latitude && latitude >= 16) return 'Q';
		else if (16 > latitude && latitude >= 8) return 'P';
		else if (8 > latitude && latitude >= 0) return 'N';
		else if (0 > latitude && latitude >= -8) return 'M';
		else if (-8 > latitude && latitude >= -16) return 'L';
		else if (-16 > latitude && latitude >= -24) return 'K';
		else if (-24 > latitude && latitude >= -32) return 'J';
		else if (-32 > latitude && latitude >= -40) return 'H';
		else if (-40 > latitude && latitude >= -48) return 'G';
		else if (-48 > latitude && latitude >= -56) return 'F';
		else if (-56 > latitude && latitude >= -64) return 'E';
		else if (-64 > latitude && latitude >= -72) return 'D';
		else if (-72 > latitude && latitude >= -80) return 'C';
		else return 'Z';
	}

	setEllipsoid(name: string) {
		switch (name) {
			case 'Airy':
				this.a = 6377563;
				this.eccSquared = 0.00667054;
				break;
			case 'Australian National':
				this.a = 6378160;
				this.eccSquared = 0.006694542;
				break;
			case 'Bessel 1841':
				this.a = 6377397;
				this.eccSquared = 0.006674372;
				break;
			case 'Bessel 1841 Nambia':
				this.a = 6377484;
				this.eccSquared = 0.006674372;
				break;
			case 'Clarke 1866':
				this.a = 6378206;
				this.eccSquared = 0.006768658;
				break;
			case 'Clarke 1880':
				this.a = 6378249;
				this.eccSquared = 0.006803511;
				break;
			case 'Everest':
				this.a = 6377276;
				this.eccSquared = 0.006637847;
				break;
			case 'Fischer 1960 Mercury':
				this.a = 6378166;
				this.eccSquared = 0.006693422;
				break;
			case 'Fischer 1968':
				this.a = 6378150;
				this.eccSquared = 0.006693422;
				break;
			case 'GRS 1967':
				this.a = 6378160;
				this.eccSquared = 0.006694605;
				break;
			case 'GRS 1980':
				this.a = 6378137;
				this.eccSquared = 0.00669438;
				break;
			case 'Helmert 1906':
				this.a = 6378200;
				this.eccSquared = 0.006693422;
				break;
			case 'Hough':
				this.a = 6378270;
				this.eccSquared = 0.00672267;
				break;
			case 'International':
				this.a = 6378388;
				this.eccSquared = 0.00672267;
				break;
			case 'Krassovsky':
				this.a = 6378245;
				this.eccSquared = 0.006693422;
				break;
			case 'Modified Airy':
				this.a = 6377340;
				this.eccSquared = 0.00667054;
				break;
			case 'Modified Everest':
				this.a = 6377304;
				this.eccSquared = 0.006637847;
				break;
			case 'Modified Fischer 1960':
				this.a = 6378155;
				this.eccSquared = 0.006693422;
				break;
			case 'South American 1969':
				this.a = 6378160;
				this.eccSquared = 0.006694542;
				break;
			case 'WGS 60':
				this.a = 6378165;
				this.eccSquared = 0.006693422;
				break;
			case 'WGS 66':
				this.a = 6378145;
				this.eccSquared = 0.006694542;
				break;
			case 'WGS 72':
				this.a = 6378135;
				this.eccSquared = 0.006694318;
				break;
			case 'ED50':
				this.a = 6378388;
				this.eccSquared = 0.00672267;
				break;
			case 'WGS 84':
			case 'EUREF89':
			case 'ETRS89':
				this.a = 6_378_137;
				this.eccSquared = 0.00669438;
				break;
			default:
				this.status = true;
		}
	}

	private toDegrees(rad: number): number {
		return (rad * 180) / Math.PI;
	}

	private toRadians(deg: number): number {
		return (deg * Math.PI) / 180;
	}

	private precisionRound(number: number, precision: number): number {
		const factor = 10 ** precision;
		return Math.round(number * factor) / factor;
	}
}
