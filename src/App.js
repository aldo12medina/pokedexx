import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddPokemon from './pages/AddPokemon';
import EditPokemon from './pages/EditPokemon'; // Importa el componente de edición
import './App.css'; // Mantenemos el CSS base

function App() {
  return (
    <Router>
      <main className="container p-5">
        <h1 className="title is-1 has-text-centered">Pokédex App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddPokemon />} />
          <Route path="/edit/:id" element={<EditPokemon />} /> {/* Ruta para editar */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;