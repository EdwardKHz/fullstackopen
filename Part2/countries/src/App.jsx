import {useEffect, useState} from "react";
import {getCountries} from "../../../../../Desktop/countries/src/services/countries.js";
import Country from "../../../../../Desktop/countries/src/components/Country.jsx";

function App() {

    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        getCountries().then(data => {
            setCountries(data);
        })
    }, []);

    const handleChange = (e) => {
        setSearch(e.target.value);
        setSelectedCountry(null);
    }

    const countryFilter = () => {
        return countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
    }

    const showCountry = (country) => {
        return (
            <Country name={country.name.common} capital={country.capital} area={country.area}
                     languages={country.languages} flag={country.flags.png}/>
        )
    }

    const renderCountries = () => {
        const filter = countryFilter();
        console.log(filter.length);
        if (filter.length === 1) {
            const country = filter[0];
            return showCountry(country);
        } else if (filter.length >= 10) {
            return <p>too many matches, specify another filter..</p>
        } else {
            return filter.map(country => (
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => setSelectedCountry(country)}>show</button>
                </div>
            ))
        }
    }

    return (
        <div>
            <label>find countries </label>
            <input type="text" value={search} onChange={handleChange}/>
            {renderCountries()}
            {selectedCountry && showCountry(selectedCountry)}
        </div>
    )

}

export default App
