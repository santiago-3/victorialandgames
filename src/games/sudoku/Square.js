import styles from '../../styles/sudoku.module.css'

function Square({
    rowIndex,
    colIndex,
    value,
    highlighted,
    updateValue,
    setFocusTarget,
}) {
    let classes = [styles.square]
    if (highlighted) {
        classes.push(styles.highlighted)
    }
    if ((colIndex + 1) % 3 === 0) {
        classes.push(styles['border-right'])
    }
    return (
        <div className={classes.join(' ')}>
            <input
                type="text"
                onKeyUp={e => updateValue(rowIndex, colIndex, e.keyCode)}
                onFocus={e => setFocusTarget(e.target)} 
                value={value}
            />
        </div>
    )
}

export default Square
