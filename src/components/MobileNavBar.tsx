import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
// import { CSSTransition } from "react-transition-group";

const MobileNavbar = () => {

      let navigate = useNavigate();
    const { authState, setAuthState } = useContext(AuthContext);
    const [isOpened, setIsOpened] = useState(false);
    

      const onDisconnect = () => {
            localStorage.removeItem("accessToken");
            navigate("/")
    }
    
    function navbarOnclickFunction() {
        isOpened ? setIsOpened(false) : setIsOpened(true)
    }


      return (
          <nav className="mobile__navbar">
              
                <div className="mobile__navbar__closed">
                    <button onClick={navbarOnclickFunction}>
                      <div className="mobile__navbar__logo"></div>
                      <div className="mobile__navbar__logo"></div>
                      <div className="mobile__navbar__logo"></div>
                    </button>
                    <p>MAISON PLISSON</p>{" "}
                </div>

              {isOpened ? (
            <>
              
                in={isOpened}
                timeout={750}
                classNames="mobile__navbar__opened"
                unmountOnExit
              
                <div className="mobile__navbar__opened">
                  <div className="lmp_logo">
                        <p>MAISON PLISSON</p>{" "}
                  </div>
                  {authState.isDirection ? (<div onClick={() => {navigate("/nouveauplanning")}}>Créer un planning</div>) : null}
                  <div onClick={() => {navigate("/planning/0")}}>Planning actuel</div>
                  <div onClick={() => {navigate("/anciensplannings")}}>Anciens plannings</div>
                  <div onClick={onDisconnect}>Se déconnecter</div>
                </div>
              
                
              </>
              ) : null}
                
                  
            </nav>
      );
};

export default MobileNavbar;
