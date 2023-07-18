import './styles/App.css'
import Minesweeper from './games/minesweeper/GameManager.js'
import Sudoku from './games/sudoku/GameManager.js'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainMenu from './MainMenu.js'

function App() {
return (
<div className="App">
    <header className="App-header">
        <MainMenu />
    </header>
    <div class="content">     
        <BrowserRouter>
            <Routes>
                <Route path="/minesweeper" element={<Minesweeper />} />
                <Route path="/sudoku" element={<Sudoku />} />
            </Routes>
        </BrowserRouter>
    </div>
</div>
);
}

export default App
