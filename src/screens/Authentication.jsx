import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser.js";
import "./Authentication.css";

// Define an enumeration for authentication modes
export const AuthenticationMode = Object.freeze({
    SignIn: 'SignIn',
    SignUp: 'SignUp'
});

// Authentication component to handle both sign-in and sign-up
export default function Authentication({ authenticationMode }) {
    const { user, setUser, signUp, signIn } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signFunction = authenticationMode === AuthenticationMode.SignUp ? signUp : signIn;
        signFunction().then(response => {
            navigate(authenticationMode === Authentication.SignUp ? '/signin' : '/');
            //navigate(authenticationMode === AuthenticationMode.SignUp ? '/signin' : '/');
        })
        .catch(error => {
            alert(error);
        });
    }

    // Render the authentication form
    return (
        <div className="auth-container">
            <h3>
                {authenticationMode === AuthenticationMode.SignIn ?
                    'Sign in' : 'Sign up'}
            </h3>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input 
                placeholder='Email' 
                value={user.email || ""}
                onChange={e => setUser({...user, email: e.target.value})}   
                />
                <label>Password</label>
                <input 
                placeholder='Password' 
                type='password' 
                value={user.password || ""}
                onChange={e => setUser({...user, password: e.target.value})}
                />
                <button type='submit'>{authenticationMode === AuthenticationMode.SignIn ?
                    'Login' : 'Submit'}</button>

                <Link to={authenticationMode === AuthenticationMode.SignIn ? '/signup' : '/signin'}>
                    {authenticationMode === AuthenticationMode.SignIn ?
                        'No account? Sign up' : 'Already signed up? Sign in'}
                </Link>
            </form>
        </div>
    );
}