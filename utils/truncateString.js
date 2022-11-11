export function truncateName(string){
    string = string.replace(/(\s\d+)/gi, '')
        .split(' ')
        .map((str, index) => index > 1 ? `${str[0]}.` : str)
        .join(' ')
        .toLowerCase();
    return string
}