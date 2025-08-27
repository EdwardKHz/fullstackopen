import CapitalWeather from "./CapitalWeather.jsx";

const Country = ({name, capital, area, languages, flag}) => {
    return (
        <div>
            <h1>{name}</h1>
            <p>capital {capital}</p>
            <p>area {area}</p>
            <h3>Languages</h3>
            <ul>
                {Object.values(languages).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={flag} alt=""/>
            <CapitalWeather city={capital} />
        </div>
    )
}

export default Country;