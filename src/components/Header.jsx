import headerImage from "../assets/headerimage.png";
import "./Header.css";

export default function Header() {
    return (
        <div
            id="header"
            style={{
                backgroundImage: `url(${headerImage})`
            }}
        >
        </div>
    );
}