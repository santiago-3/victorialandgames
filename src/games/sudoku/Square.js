import styles from '../../styles/sudoku.module.css'

function Square({
    rowIndex,
    colIndex,
    value,
    highlighted,
    updateValue,
    remainingPerRow,
    remainingPerCol,
    remainingPerArea,
}) {
    let classes = [styles.square]
    if (highlighted) {
        classes.push(styles.highlighted)
    }
    if ((colIndex + 1) % 3 === 0) {
        classes.push(styles['border-right'])
    }
    let displayValue = value
    if (value === "") {
        displayValue = [1,2,3,4,5,6,7,8,9].filter( number => {
            return remainingPerRow.includes(number)
                && remainingPerCol.includes(number)
                && remainingPerArea.includes(number)
        }).length

        classes.push(styles.empty)
    }
    return (
        <div className={classes.join(' ')}>
            <input
                type="text"
                onKeyUp={e => updateValue(rowIndex, colIndex, e.keyCode, e.target)}
                value={displayValue}
            />
        </div>
    )
}

export default Square
