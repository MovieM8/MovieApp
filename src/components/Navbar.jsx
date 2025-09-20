import { Link } from 'react-router-dom'
import { useUser } from '../context/useUser.js'

export default function Navbar() {
    const { user, logout } = useUser();

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">The Movie App</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/screeningtimes">Screening times</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Movie search</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/reviews">Movie reviews</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/myprofile/favorites">Favorites</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/groups">Groups</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/myprofile">My profile</Link>
                        </li>
                        {!user.email ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/signin">Login</Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
