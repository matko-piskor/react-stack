export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stripLeadingSlash(str: string) {
    return str.replace(/^\/+/, '');
}
