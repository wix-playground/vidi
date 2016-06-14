export function getExtFromUrl(url: string): string {
    return url.split('.').pop();
}
