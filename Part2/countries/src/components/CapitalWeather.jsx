import {useEffect, useState} from "react";
import {getWeather} from "../services/countries.js";

const CapitalWeather = ({city}) => {

    const [weather, setWeather] = useState(null);

    useEffect(() => {
        getWeather(city).then(data => {
            setWeather(data);
        })
    }, [city]);

    if(!weather){
        return <p>loading..</p>
    }

    return (
        <div>
            <h2>Weather in {city}</h2>
            <p>Temperature: {weather.main.temp} °C</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    )
}

export default CapitalWeather;

