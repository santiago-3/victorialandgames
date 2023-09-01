import { useState, useEffect } from 'react'
import Game from './Game.js'
import styles from '../../styles/minesweeper.module.css'

function GameManager() {

    let [width, setWidth]           = useState(8)
    let [height, setHeight]         = useState(10)
    let [totalMines, setTotalMines] = useState(16)
    let [gameKey, setGameKey]       = useState(1)

    return (
        <div class={styles.minesweeper}>
            <div class='title-bar'>
                Mine sweeper
            </div>
            <div class={styles['status-bar']}>
                <div class={styles.param}>
                    <label>Width</label>
                    <input
                        type="text"
                        placeholder="width"
                        value={width}
                        onChange={ (e) => { setWidth(e.target.value) }}
                    />
                </div>
                <div class={styles.param}>
                    <label>Height</label>
                    <input
                        type="text"
                        placeholder="height"
                        value={height}
                        onChange={ (e) => { setHeight(e.target.value) }}
                    />
                </div>
                <div class={styles.param}>
                    <label>Mines</label>
                    <input
                        type="text"
                        placeholder="total mines"
                        value={totalMines}
                        onChange={ (e) => { setTotalMines(e.target.value) }}
                    />
                </div>
                <div>
                    <button onClick={() => { setGameKey(gameKey+1) }}>
                        Restart
                    </button>
                </div>
            </div>
            <Game width={width} height={height} totalMines={totalMines} key={gameKey} />
        </div>
    )
}

export default GameManager
