import {weatherCodes} from "./constants";


function EachDayWeather({weatherDetails, eachWeather, index}){

    const weatherCode = weatherDetails?.weathercode[index];
    return(
        <div className="each-day-weather-section">
            <h3>{index === 0 && 'Today'} {eachWeather}</h3>
            <div className="weather-details-each-weather">
                <span>Max {weatherDetails?.temperature_2m_max[index]} °C</span>
                <span>Min {weatherDetails?.temperature_2m_min[index]} °C</span>
                <span>Sunset {weatherDetails?.sunset[index]} </span>
                <span>Sunrise {weatherDetails?.sunrise[index]} </span>
                <span>{weatherCodes[weatherCode] || weatherCode}</span>
                <span>Precipitation Sum {weatherDetails?.precipitation_sum[index]}</span>
            </div>

        </div>
    )
}


export default EachDayWeather;