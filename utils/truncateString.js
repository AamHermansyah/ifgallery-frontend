export function truncateName(string){
    string = string.split(' ').map((str, index) => index > 1 ? `${str[0]}.` : str);
    return string.join(' ')
}