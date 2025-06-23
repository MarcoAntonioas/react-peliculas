import { useState, useEffect } from 'react';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState(null);
  const [calificaciones, setCalificaciones] = useState({});

  const API_KEY = '21964095';

  useEffect(() => {
    const guardadas = localStorage.getItem('calificaciones');
    if (guardadas) setCalificaciones(JSON.parse(guardadas));
  }, []);

  useEffect(() => {
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
  }, [calificaciones]);

  const buscarPeliculas = async () => {
    if (!busqueda) return;

    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${busqueda}&apikey=${API_KEY}`);
      const data = await res.json();

      if (data.Response === "True") {
        setPeliculas(data.Search);
        setError(null);
      } else {
        setPeliculas([]);
        setError(data.Error);
      }
    } catch (err) {
      setError('Error buscando peliculas');
      setPeliculas([]);
    }
  };

  const manejarCalificacion = (imdbID, valor) => {
    setCalificaciones(prev => ({
      ...prev,
      [imdbID]: valor
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '30px',
          marginTop: '10px',
        }}
      >
        <h1 style={{ marginBottom: '15px' }}>Buscar la película</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Escribí el nombre de la película"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') buscarPeliculas() }}
            style={{ padding: '8px', width: '300px' }}
          />
          <button
            onClick={buscarPeliculas}
            style={{ padding: '8px' }}
          >
            Buscar
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {peliculas.map(peli => (
          <div key={peli.imdbID} style={{ marginBottom: '30px' }}>
            <h2>{peli.Title} ({peli.Year})</h2>
            <img
              src={peli.Poster !== "N/A" ? peli.Poster : 'https://via.placeholder.com/200x300?text=Sin+Imagen'}
              alt={peli.Title}
              style={{ width: '200px' }}
            />
            <div style={{ marginTop: '10px' }}>
              <label>
                Calificación (1-10):{' '}
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={calificaciones[peli.imdbID] || ''}
                  onChange={e => manejarCalificacion(peli.imdbID, e.target.value)}
                  style={{ width: '50px' }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
