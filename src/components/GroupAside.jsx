import { Link, } from "react-router-dom"
import "./GroupAside.css";

export default function GroupAside() {
    return (
        <ul className="group-aside-list">
            <li>
                <Link to="/groups" className="group-aside-btn">All Groups</Link>
            </li>
            <li>
                <Link to="/myprofile/mygroups" className="group-aside-btn">My Groups</Link>
            </li>
        </ul>
    );
}