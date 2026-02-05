export function formatId(id: number | string, type: 'booking' | 'package' | 'boat' | 'staff' | 'user'): string {
    const numId = Number(id);
    if (isNaN(numId)) return String(id);

    switch (type) {
        case 'booking': return '#' + String(numId).padStart(4, '0');
        case 'package': return '#' + String(numId).padStart(3, '0');
        case 'boat': return '#' + String(numId).padStart(2, '0');
        case 'staff': return '#' + String(numId).padStart(2, '0');
        case 'user': return '#' + String(numId).padStart(3, '0');
        default: return '#' + String(numId);
    }
}
