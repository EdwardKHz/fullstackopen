import {useState} from "react";


const Statistics = ({good, bad, neutral}) => {
    const all = good + bad + neutral;
    const average = all === 0 ? 0 : (good - bad) / all;
    const positive = all === 0 ? 0 : (good / all) * 100 + " %";

    return (
        <>
            <h1>statistics</h1>
            <table>
                <tbody>
                <StatisticLine text="good" value={good}/>
                <StatisticLine text="neutral" value={neutral}/>
                <StatisticLine text="bad" value={bad}/>
                <StatisticLine text="all" value={all}/>
                <StatisticLine text="average" value={average}/>
                <StatisticLine text="positive" value={positive}/>
                </tbody>
            </table>
        </>
    )
}

const StatisticLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const Button = ({text, onClick}) => (
    <button onClick={onClick}>{text}</button>
)

function App() {
    const [good, setGood] = useState(0);
    const [bad, setBad] = useState(0);
    const [neutral, setNeutral] = useState(0);

    return (
        <div>
            <h1>give feedback</h1>
            <Button text="good" onClick={() => setGood(good + 1)}/>
            <Button text="neutral" onClick={() => setNeutral(neutral + 1)}/>
            <Button text="bad" onClick={() => setBad(bad + 1)}/>
            {(good > 0 || bad > 0 || neutral > 0) && <Statistics good={good} bad={bad} neutral={neutral}/>}
        </div>
    )

}

export default App
