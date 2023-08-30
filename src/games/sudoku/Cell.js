import styles from '../../styles/sudoku.module.css'

function Cell({
    rowIndex,
    colIndex,
    value,
    highlighted,
    locked,
    updateValue,
    cellSelected,
    remainingPerRow,
    remainingPerCol,
    remainingPerRegion,
}) {
    let classes = [styles.cell]
    if (highlighted) {
        classes.push(styles.highlighted)
    }
    if (!locked) {
        classes.push(styles['non-locked'])
    }
    if ((colIndex + 1) % 3 === 0) {
        classes.push(styles['border-right'])
    }
    let displayValue = value
    if (value === "" && false) {
        displayValue = [1,2,3,4,5,6,7,8,9].filter( number => {
            return remainingPerRow.includes(number)
                && remainingPerCol.includes(number)
                && remainingPerRegion.includes(number)
        }).length

        classes.push(styles.empty)
    }
    return (
        <div className={classes.join(' ')}>
            <input
                type="text"
                onKeyUp={e => { updateValue(rowIndex, colIndex, e.keyCode, e.target) }}
                onFocus={e => { cellSelected(rowIndex, colIndex, e.target) }}
                value={displayValue}
            />
        </div>
    )
}

export default Cell
