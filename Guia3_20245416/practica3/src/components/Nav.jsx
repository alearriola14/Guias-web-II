export const Nav = ({ children }) => {
    return (
        <nav className="nav-bar">{children}</nav>
    )
}

export function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>palomitas de papel</h1>
        </div>
    )
}

export function Search({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Buscar peliculas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    )
}
export function NumResults({ movies }) {
    return (
        <p className="num-results">
            <strong>{movies.length}</strong> resultados encontrados
        </p>
    )
}