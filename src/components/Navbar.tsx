import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Navbar = () => {

      let navigate = useNavigate();
      const { authState, setAuthState } = useContext(AuthContext);

      const onDisconnect = () => {
            localStorage.removeItem("accessToken");
            navigate("/")
      }
      return (
            <nav>
                  <div className="lmp_logo">
                        <p>MAISON PLISSON</p>{" "}
                  </div>
                  {authState.isDirection ? (<p onClick={() => {navigate("/nouveauplanning")}}>Créer un planning</p>) : <div></div>}
                  
                  <p onClick={() => {navigate("/planning/0")}}>Planning actuel</p>
                  <p onClick={() => {navigate("/anciensplannings")}}>Anciens plannings</p>
                  <p onClick={onDisconnect}>Se déconnecter</p>
            </nav>
      );
};

export default Navbar;
