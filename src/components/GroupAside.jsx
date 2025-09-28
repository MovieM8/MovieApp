import { Link, } from "react-router-dom"
import { useUser } from "../context/useUser.js";
import "./GroupAside.css";

export default function GroupAside() {
    return (
        <ul>
            <li><Link to="/groups">All Groups</Link></li>
            <li><Link to="/myprofile/mygroups">My Groups</Link></li>
        </ul>
    );
}