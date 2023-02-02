import React from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavBar";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



const OldSchedules = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      const id = params ? parseInt(params.id) : 0;


      let navigate = useNavigate();

      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);

      useEffect(() => {
            if (!localStorage.getItem("accessToken")) {
                  navigate("/login");
            } else {
                  axios
                        .get(
                              "http://localhost:3001/auth/verifyToken",
                              {
                                    headers: { accessToken: localStorage.getItem("accessToken") },
                              }
                        )
                        .then((response) => {
                              if (response.data.error) {
                                    alert("Session expirée, veuillez vous reconnecter !");
                                    localStorage.removeItem("accessToken");
                                    navigate("/");
                              } else {
                                    setAuthState({
                                          username: response.data.username,
                                          nom_complet: response.data.complete_name,
                                          fonction: response.data.function,
                                          id: response.data.id,
                                          isDirection: response.data.isDirection,
                                          status: true,
                                    });
                                    axios
                                          .get("http://localhost:3001/employee", {
                                                headers: { accessToken: localStorage.getItem("accessToken") },
                                          })
                                          .then((response) => {
                                                setListOfEmployees(response.data.listOfEmployees);
                                          })
                                    axios
                                          .get("http://localhost:3001/planning", {
                                                headers: { accessToken: localStorage.getItem("accessToken") },
                                          })
                                          .then((response) => {
                                                setListOfPlannings(response.data.listOfPlannings);
                                                setIsLoaded(true);
                                                
                                          });
                              }
                        })
            }

    
    
      }, [!listOfPlannings]);

      const filteredListNoDirection = listOfPlannings.filter((planning, index, self) => 
            planning.nom_employe === authState.nom_complet &&
  index === self.findIndex(t => (
    t.planning_id === planning.planning_id
  ))
      );
      
      const filteredListDirection = listOfPlannings.filter((planning, index, self) => 
  index === self.findIndex(t => (
    t.planning_id === planning.planning_id
  ))
);






      if (!isLoaded) {
            return <div>chargement en cours</div>
      } else {
            
            return (
                  <>
                        <MobileNavbar />
                        <Navbar />
                        <div className="oldSchedule_container">
                              <h1 className="oldSchedule_container__title">LISTE DES PLANNINGS</h1>
                              <div className="oldSchedule_container__list">
                                    {authState.isDirection ? filteredListDirection.map((value, key) => {
                                          return (
                                                <div key={key} className="planningContainer"
                                                      onClick={() => { navigate(`/planning/${value.planning_id}`); }}
                                                >Période du {value.periode}</div>
                                          )
                                    }) : filteredListNoDirection.map((value, key) => {
                                          return (
                                                <div key={key} className="planningContainer"
                                                      onClick={() => { navigate(`/planning/${value.planning_id}`); }}
                                                >Période du {value.periode}</div>
                                          )
                                    })}
                                    </div>
                              
                        </div>
                        
                  
                  </>
            )
      }

}

export default OldSchedules;
