import axios from 'axios';

export async function getWeatherInfo(location: string) {
    // location hanoi = 353412
    // const city = '353412';
    const apikey = 'd6jXqWZCGWDCybSFQZRq2w7PDOHpGLmA';
    let url = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + location + '?language=en&apikey=' + apikey;

    var items =  await axios.get(url);

    var data = items.data;

    return data;
}