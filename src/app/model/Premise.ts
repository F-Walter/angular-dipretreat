import { PremiseGeom } from './PremiseGeom';

export class Premise {
    public get creation_year(): string {
        return this._creation_year;
    }
    public set creation_year(value: string) {
        this._creation_year = value;
    }
    public get last_inspection(): string {
        return this._last_inspection;
    }
    public set last_inspection(value: string) {
        this._last_inspection = value;
    }
    public get corrosion_level(): number {
        return this._corrosion_level;
    }
    public set corrosion_level(value: number) {
        this._corrosion_level = value;
    }
    public get last_maintanance(): string {
        return this._last_maintanance;
    }
    public set last_maintanance(value: string) {
        this._last_maintanance = value;
    }
    public get premises_geom(): PremiseGeom {
        return this._premises_geom;
    }
    public set premises_geom(value: PremiseGeom) {
        this._premises_geom = value;
    }
    public get premises_name(): string {
        return this._premises_name;
    }
    public set premises_name(value: string) {
        this._premises_name = value;
    }
    public get premises_id(): string {
        return this._premises_id;
    }
    public set premises_id(value: string) {
        this._premises_id = value;
    }

    constructor(
        private _premises_id: string,
        private _premises_name: string,
        private _premises_geom: PremiseGeom,
        private _last_maintanance: string,
        private _corrosion_level: number,
        private _last_inspection: string,
        private _creation_year: string) {

    }
}