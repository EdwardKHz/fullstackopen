const Notification = ({message, color, background}) => {
    const style = {
        color: color,
        background: background,
        fontSize: 20,
        border: `2px solid ${color}`,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) {
        return null;
    }

    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Notification;