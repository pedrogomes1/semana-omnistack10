import React, { useState, useEffect } from "react";
import api from "./services/api";
import "./global.css";
import "./app.css";
import "./Sidebar.css";
import "./Main.css";

import DevItem from "./components/DevList";
import DevForm from "./components/DevForm";

function App() {
  const [devs, setDevs] = useState([]); //Tenho que armazenar os devs em algum estado para poder mostrar na tela

  useEffect(() => {
    //Use effect quero que quando fazer essa busca ela seja buscada uma única vez
    //Tenho que criar uma função async dentro do useEffect pq a propria n permite colocar async diretamente nela
    async function loadDevs() {
      const response = await api.get("/devs");

      setDevs(response.data); // O response me traz todos os devs
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post("/devs", data);
    setDevs([...devs, response.data]); 
  }

  async function handleDeleteUser(id) {
    let response = await api.delete(`/devs/${id}`);
    response = await api.get("/devs");
    setDevs(response.data);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastar</strong>
        <DevForm onSubmit={handleAddDev} />
        {/* Como não é possivel mover a função handleAdd para o componente pois o dev e setDev usa lá em baixo 
      eu passo a função por parâmetro para o componente recebê-la */}
      </aside>

      <main>
        <ul>
          {devs.map((
            dev //Por isso precisei crirar um estado dev lá em cima .. usa o () ao invés de {}, pq o () retorna o retorno da função map
          ) => (
            <DevItem
              key={dev._id}
              dev={dev}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
