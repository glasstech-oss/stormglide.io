export type SerializedDate = string | number | Date | { _seconds?: number; seconds?: number } | null | undefined;

export function toDate(value: SerializedDate): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'object') {
        const seconds = value._seconds ?? value.seconds;
        return typeof seconds === 'number' ? new Date(seconds * 1000) : null;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: SerializedDate, fallback = 'Not configured'): string {
    return toDate(value)?.toLocaleDateString() || fallback;
}
