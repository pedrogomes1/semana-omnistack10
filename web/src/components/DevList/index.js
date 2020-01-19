import React from "react";
import "./style.css";
import lixeira from "../../assets/download.png";

export default function DevItem({ dev, handleDeleteUser }) {
  // Ou poderia colocar const { dev, handleDeleteUser } = props;

  async function deleteUser() {
    await handleDeleteUser(dev._id);
  }

  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(", ")}</span>
        </div>
        <div className="delete">
          <img src={lixeira} alt="" onClick={deleteUser} />
        </div>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>
        Acessar perfil no github
      </a>
    </li>
  );
}
