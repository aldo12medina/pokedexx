import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // <-- Cambia esto

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const { data, error } = await supabase
          .from('pokemons')
          .select('*'); // <-- Nueva forma con Supabase

        if (error) {
          throw error;
        }

        setPokemons(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los Pokémon:', err);
        setError('No se pudieron cargar los Pokémon.');
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <p>Cargando Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Pokédex</h1>
      {pokemons.map(p => (
        <div key={p.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px', borderRadius: '8px' }}>
          <h2>{p.nombre}</h2>
          <p>Tipo: {p.tipo1}{p.tipo2 ? ` / ${p.tipo2}` : ''}</p>
          <p>HP: {p.hp}</p>
          <p>{p.descripcion}</p>
          {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} width="120" />}
        </div>
      ))}
    </div>
  );
}

export default App;