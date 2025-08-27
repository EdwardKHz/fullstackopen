import Header from "./Header.jsx";
import Content from "./Content.jsx";
import Total from "./Total.jsx";

const Course = ({course}) => {
    return (
        <div>
            <Header name={course.name}/>
            <Content parts={course.parts}/>
            <Total
                total={
                    course.parts.reduce((sum, part) => sum + part.exercises, 0)
                }
            />
        </div>
    )
}

export default Course;