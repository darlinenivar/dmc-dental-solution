import { useState } from "react";
import "./topbar.css";

export default function Topbar({ query, onQueryChange, userEmail }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <input
          type="text"
          placeholder="Search patient name..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">👤</div>
        </div>

        {open && (
          <div className="profile-menu">
            <div className="email">{userEmail}</div>
            <button>Notifications</button>
            <button>Edit Profile</button>
            <button>Settings</button>
            <hr />
            <button className="logout">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
