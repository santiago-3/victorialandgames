import styles from '../../styles/minesweeper.module.css'

function Square({
        rowNum,
        squareNum,
        hasMine,
        surroundingMines,
        revealed,
        hasFlag,
        action,
        rightAction,
        lost,
        gameOver
    }) {
    let classes = [styles.square]
    let number = <></>
    let img = <></>
    if (hasFlag) {
        revealed = false
        if (gameOver && !hasMine){
            classes.push(styles.crossedFlag)
            img = <img src="/flag-crossed.png" />
        }
        else {
            classes.push(styles.hasFlag)
            img = <img src="/flag.png" />
        }
    }
    if (revealed) {
        classes.push(styles.revealed)
        if (hasMine) {
            classes.push(styles.hasMine)
            if (lost) {
                classes.push(styles.lost)
            }
            img = <img src="/mine.png" />
        }
        else if (surroundingMines > 0){
            number = <div class={styles.display}>{surroundingMines}</div>
            classes.push(styles[`mines-${surroundingMines}`])
        }
    }
    return (
        <div className={ classes.join(' ') } onClick={action} onContextMenu={rightAction}>
            {number}
            {img}
        </div>
    )
}

export default Square
