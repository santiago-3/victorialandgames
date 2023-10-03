import Game from './Game.js'
import styles from '../../styles/puzzles.module.css'

const puzzles = [
    {
        name: 'andybay',
        fileName: 'andy_bay_canyon.jpg',
    },
    {
        name: 'city',
        fileName: 'city_crop.jpg',
    },
    {
        name: 'ellenchan',
        fileName: 'ellenchan_crop.jpg',
    },
    {
        name: 'gruendercoach',
        fileName: 'gruendercoach_crop.jpg',
    },
    {
        name: 'kinkate',
        fileName: 'kinkate_mountain_landscape.jpg',
    },
    {
        name: 'princess',
        fileName: 'princess_crop.jpg',
    },
]

const GameManager = ({items, selected, setSelected}) => {

    if (selected !== items.PUZZLES) {
        setSelected(items.PUZZLES)
    }

    return (
        <div className={styles.puzzles}>
            <Game puzzles={puzzles} />
        </div>
    )
    
}

export default GameManager
