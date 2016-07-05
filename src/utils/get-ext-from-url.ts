/**
 * Simple naive util function that extracts the file extension from the url.
 * Used mainly in [[URLSourceHandler]].
 * 
 * @param url The URL to extract the extension from.
 * @returns The file extension.  
 */
export function getExtFromUrl(url: string): string {
    return url.split('.').pop();
}
