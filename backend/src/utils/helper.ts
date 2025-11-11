import Decimal from 'decimal.js';


export const d = (x: string | number | Decimal): Decimal => new Decimal(x || 0);


export const q2 = (x: Decimal): string => x.toDecimalPlaces(2).toFixed(2);
export const q4 = (x: Decimal): string => x.toDecimalPlaces(4).toFixed(4);


export const normalizeMoney = (raw: any): string => {
if (raw === null || raw === undefined || raw === '') return '0.00';
const s = String(raw).trim().toUpperCase();
// remove all non numeric except , . -
let t = s.replace(/[^\d,.-]/g, '');
if ((t.match(/,/g) || []).length === 1 && (t.match(/\./g) || []).length >= 1) {
// 1.234,56 -> 1234.56
t = t.replace(/\./g, '').replace(',', '.');
} else if ((t.match(/,/g) || []).length > 1 && !t.includes('.')) {
t = t.replace(/,/g, '');
} else if ((t.match(/,/g) || []).length === 1 && !t.includes('.')) {
t = t.replace(',', '.');
}
try {
return new Decimal(t).toDecimalPlaces(2).toFixed(2);
} catch {
return '0.00';
}
};


export const normalizeTax = (raw: any): string => {
const def = new Decimal(process.env.DEFAULT_TAX_RATE || '0.10');
if (raw === null || raw === undefined || raw === '') return q4(def);
const s = String(raw).trim().replace('%', '');
try {
let v = new Decimal(s);
if (v.greaterThan(1)) v = v.div(100);
return q4(v);
} catch {
return q4(def);
}
};

export const yyyymmdd = (d: Date): number => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();