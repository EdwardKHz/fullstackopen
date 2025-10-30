import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const fetchCountry = async (name) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
    return { found: true, data: response.data }
  } catch (error) {
    console.log(error)
    return { found: false }
  }
}
const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect( () => {
    if (name) {
      const fetchData = async () => {
        const result = await fetchCountry(name)
        setCountry(result)
        console.log(result)
      }

      fetchData()
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) return null
  if (!country.found) return <div>not found...</div>

  const data = country.data[0]

  return (
    <div>
      <h3>{data.name.common}</h3>
      <div>capital: {data.capital[0]}</div>
      <div>population: {data.population}</div>
      <img
        src={data.flags.png}
        height="100"
        alt={`flag of ${data.name.common}`}
      />
    </div>
  )
}


const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App