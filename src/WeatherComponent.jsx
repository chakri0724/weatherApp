import {useEffect, useRef, useState} from "react"
import './weather.scss'
import EachDayWeather from "./EachDayWeather";
import { getList, setList } from "./sessionStorageService";




const weather_api = (latitude, longitude ) => `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=auto`

function WeatherComponent (){
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [data, setData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const isMounted = useRef(false);
    const [latLang, setLatLang] = useState({});
    const [weatherDetails, setWeatherDetails] = useState({});
    const [favouriteCities, setFavouriteCities] = useState(getList('favList') || []);





    const getAllcitiesAndCountries = async()=>{
        try{
            const listResult = await fetch(`https://countriesnow.space/api/v0.1/countries`)
            const list = await listResult.json();
            setData(list.data);
        }catch (error){
            console.error(error)
        }
    }
    const getGeoLocationData = async(val) => {
        let cityVal;
        let stateVal;
        if(val){
            [cityVal, stateVal] = val.split(',');
        }

        if(!val) return ;
        try {
            const geoLocationResult = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityVal}`); // getGeoLocations
            const geoLocationData = await geoLocationResult.json();
            const geoLocationDataVal = geoLocationData.results;

            let currentVal = geoLocationDataVal.find((eachVal) => eachVal?.admin1?.toLowerCase() === stateVal?.toLowerCase());

            if(!currentVal){
                currentVal = geoLocationDataVal[0];
            }
            setLatLang({
                latitude: currentVal.latitude,
                longitude: currentVal.longitude
            });

        }catch(error){
            console.error(error);
        }
    }

    const getWeatherDetails = async(latitude, longitude) =>{
        try{
            const weatherResult = await fetch(weather_api(latitude, longitude));
            const weatherData = await weatherResult.json();
            setWeatherDetails(weatherData?.daily);
        }catch (error){
            console.error(error);
        }
    }

    const fixedToDecimalTwo = (val) => Math.floor(val);
    useEffect(()=>{
      if(latLang && latLang.latitude && latLang.longitude){
          getWeatherDetails(fixedToDecimalTwo(latLang.latitude), fixedToDecimalTwo(latLang.longitude));
      }
    },[latLang])

    const citiesDataVal = (countryVal) => {
        setCity('')
        setCountry(countryVal);
        setLatLang({});
        setWeatherDetails({});
        setCitiesData(data[data.findIndex((each) => each?.country === countryVal)]?.cities);
    }

    const settingFavouriteCities = () => {

        let filteredCities = favouriteCities.filter((each) => each.city === city)
        if(filteredCities.length > 0) return;
        setFavouriteCities([...favouriteCities, { city: city , country: country}])
    }


    useEffect(()=>{
        if(favouriteCities){
            setList('favList', favouriteCities);
        }
    },[favouriteCities])

    useEffect(()=> {
        getAllcitiesAndCountries();
        getGeoLocationData();
    },[])





    return (
        <>
            <div className="weather">
                <h1> Display Weather </h1>
                <div className="city-details">
                    <select name="countries" id="cars" onChange={(e) => citiesDataVal(e.target.value)} value={country}>
                        <option>Select a Country</option>
                        {data && data.length > 0 && data.map((eachCountry, index) => <option key={`${eachCountry?.country}-${index}`} value={eachCountry?.country}>{eachCountry?.country}</option>)}
                    </select>

                    <select name="cities" id="cities"  value={city} onChange={(e) => {
                        setLatLang({});
                        setWeatherDetails({});
                        setCity(e.target.value);
                    }}>
                        <option>Select a City</option>
                        {citiesData && citiesData.length > 0 && citiesData.map((eachCity) => <option key={eachCity} >{eachCity}</option>)}
                    </select>
                    <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)}></input>
                    <button onClick={() => getGeoLocationData(city)}>Get Weather Details</button>
                    <button onClick={() => settingFavouriteCities()}>Add to favourites</button>
                </div>
            </div>
            <div>
                <h3>Favourite Cities</h3>
                <ul>
                    {favouriteCities && favouriteCities.length>0 && favouriteCities.map((eachData) => <li key={eachData?.city}>{eachData?.city}</li>)}
                </ul>
            </div>
            <div>
                <h2>Weather Details for City {city}</h2>
                <div className="weather-details-section">
                    {weatherDetails?.time?.map((eachWeather, index) => <EachDayWeather key={eachWeather} weatherDetails={weatherDetails} eachWeather={eachWeather} index={index}/>)}
                </div>
            </div>
        </>
    )
}


export default WeatherComponent