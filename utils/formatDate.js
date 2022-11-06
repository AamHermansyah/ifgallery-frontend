export function getHoursAndMinutes(date){
    date = new Date(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes}`;
}
  
export function getDateWithDayName(dates){
    const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    dates = new Date(dates);
    let year = dates.getFullYear();
    let months = MONTHS[dates.getMonth()];
    let date = dates.getDate();
    let day = DAYS[dates.getDay()];
    
    date = date < 10 ? '0' + date : date;
    
    return `${day}, ${date} ${months} ${year}`
}