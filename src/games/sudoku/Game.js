import styles from '../../styles/sudoku.module.css'

function Game() {

    const coordinates = Array.from( { length: 9 }, (_,i) => i ).map( rowIndex => {
        let squares = Array.from( { length: 9 }, (_,i) => i).map( colIndex => {
            return [rowIndex, colIndex]
        })
        return squares
    })

    let board = coordinates.map( (row, rowIndex) => {
        let displayRow = row.map( (square, squareIndex) => {
            let classes = [styles.square]
            if ((squareIndex + 1) % 3 === 0) {
                classes.push(styles['border-right'])
            }
            return <div class={classes.join(' ')}></div>
        })
        let classes = [styles.row]
        if ((rowIndex + 1) % 3 === 0) {
            classes.push(styles['border-bottom'])
        }
        return <div class={classes.join(' ')}>{displayRow}</div>
    })

    return (
        <div class={styles.sudoku}>
            <div class={styles.board}>
                <div class={styles.line}>
                    {board}         
                </div>
            </div>
        </div>
    )
}

export default Game
