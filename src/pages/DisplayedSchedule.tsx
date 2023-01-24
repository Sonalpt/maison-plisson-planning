/* eslint-disable array-callback-return */
import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import moment from "moment";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



const DisplayedSchedule = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      var id = params ? parseInt(params.id) : 0;
      
      let navigate = useNavigate();

      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);
      
      var isPeriodeFound = false;
      var isPlanningFound = false;

      var planningsToFetch: any = [];

      const [tdModificationState, setTdModificationState] = useState(1);

useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
        navigate("/");
    } else {
        axios
            .get("http://localhost:3001/auth/verifyToken", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                if (response.status === 200) {
                    
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
                        });
                    axios
                        .get("http://localhost:3001/planning", {
                            headers: { accessToken: localStorage.getItem("accessToken") },
                        })
                        .then((response) => {
                            setListOfPlannings(response.data.listOfPlannings);
                            if (listOfPlannings) {
                                  setIsLoaded(true);
                            } else {
                                return;
                            } 
                        });

                              }
                        })
            }

      }, [!listOfPlannings]);
      

      function planningModificationStart(key: number) {
            const employeeRow = document.querySelector(`#employee_row_${key}`)
            const spans = employeeRow.querySelectorAll(`.spanInput`);
            spans.forEach(span => {
                  const input = document.createElement('input');
                  input.value = span.textContent;
                  span.replaceWith(input);
            });
            setTdModificationState(2)
            // const tdEnvoyer = React.createElement("td", { onClick: modifyPlanningObject(key) }, "Envoyer");
            // const tdToDelete = employeeRow.querySelector(`td:nth-child(11)`);
            // console.log(tdToDelete)
            // tdToDelete.remove();
      }

      function modifyPlanningObject(key: number) {
            let total: number = null;
            
            
            let planning: Record<string, any> = {
                  id: listOfPlannings[key].id,
                  planning_id: listOfPlannings[key].planning_id,
                  periode: listOfPlannings[key].periode,
                  nom_employe: listOfPlannings[key].nom_employe,
                  fonction: listOfPlannings[key].fonction,
                  lundi: [(document.querySelector(`#employee_row_${key} td:nth-child(3) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(3) input:last-child`) as HTMLInputElement).value],
                  mardi: [(document.querySelector(`#employee_row_${key} td:nth-child(4) input:first-child`)as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(4) input:last-child`)as HTMLInputElement).value],
                  mercredi: [(document.querySelector(`#employee_row_${key} td:nth-child(5) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(5) input:last-child`) as HTMLInputElement).value],
                  jeudi: [(document.querySelector(`#employee_row_${key} td:nth-child(6) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(6) input:last-child`) as HTMLInputElement).value],
                  vendredi: [(document.querySelector(`#employee_row_${key} td:nth-child(7) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(7) input:last-child`) as HTMLInputElement).value],
                  samedi: [(document.querySelector(`#employee_row_${key} td:nth-child(8) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(8) input:last-child`) as HTMLInputElement).value],
                  dimanche: [(document.querySelector(`#employee_row_${key} td:nth-child(9) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(9) input:last-child`) as HTMLInputElement).value],
                  total_horaires: 0
            };
            if (planning) {
                  const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
                  
                  for (let i = 0; i < days.length; i++) {
                        if (planning[days[i]][0] === "" || planning[days[i]][0] === " - " || planning[days[i]][1] === "" || planning[days[i]][1] === " - ") {
                              let horaires = planning[days[i]];
                                    for (let j = 0; j < horaires.length; j += 1) {
                                          let timeArray = [];
                                          if (horaires[j] === "" || horaires[j] === " - ") {
                                                
                                                planning[days[i]] = [...planning[days[i]], "00:00", "00:00"]
                                                
                                          } else {
                                                let times = horaires[j].split(" - ");
                                                timeArray.push(times[0], times[1]);
                                                planning[days[i]] = [...planning[days[i]], ...timeArray]
                                          }    
                              } 

                        } else {
                                    let horaires = planning[days[i]];
                                    for (let j = 0; j < horaires.length; j += 1) {
                                          let timeArray = [];
                                          let times = horaires[j].split(" - ");
                                          timeArray.push(times[0], times[1]);
                                          planning[days[i]] = [...planning[days[i]], ...timeArray]
                                    }     
                        }
                        if (planning[days[i]].length === 6) {
                              planning[days[i]].splice(0,2)
                              }
                              if (planning[days[i]].length === 0) {
                                    return;
                              }
                              if (planning[days[i]].length === 4) {
                                    const jour = planning[days[i]]; 
                                    for (let k = 0; k < jour.length; k += 2) {
                                          let start = moment(jour[k], "HH:mm");
                                          let end = moment(jour[k + 1], "HH:mm");
                                          let duration = moment.duration(end.diff(start)).asHours();
                                          total += duration;
                                    }
                              }
                        
                  }
                  planning.total_horaires = total;
            }
          
           
            planning.total_horaires = total;
            let totalInput = document.querySelector(`#employee_row_${key} td:nth-child(10)`)
           
            totalInput.textContent = total.toString();
            planningsToFetch.push(planning);
           
            const tdToDelete = document.querySelector(`#employee_row_${key} td:nth-child(12)`);
            tdToDelete.remove();
            setTdModificationState(1)
            console.log(planningsToFetch[0])
            onSubmit();
            
      }

      const onSubmit = () => {
            axios
                  .put(
                  "http://localhost:3001/planning/editplanning",
                  {
                  planning: planningsToFetch[0]
                  },
                  {
                  headers: {
                        accessToken: localStorage.getItem("accessToken"),
                  },
                  }
                  )
                  .then((response) => {
                     
                  navigate("/");
                  });
      };
      

      if (!isLoaded) {
            return <div>Pas d'emploi du temps pour le moment !</div>
      } else {

            if (id === 0 && authState.isDirection) {
                  const filteredListDirection = listOfPlannings.filter((planning, index, self) => 
                              index === self.findIndex(t => (
                              t.planning_id === planning.planning_id
                              ))
                  );
                  id = filteredListDirection[0].planning_id;
                  navigate(`/planning/${id}`)
            } else if (id === 0 && !authState.isDirection) {
                  const filteredListNoDirection = listOfPlannings.filter((planning, index, self) => 
                        planning.nom_employe === authState.nom_complet &&
                        index === self.findIndex(t => (
                        t.planning_id === planning.planning_id
                        ))
                  );
                  if (filteredListNoDirection.length < 1) {
                        id = listOfPlannings[0].planning_id
                        navigate(`/planning/${id}`)
                  } else {
                        id = filteredListNoDirection[0].planning_id;
                        navigate(`/planning/${id}`)
                  }
                  
            }
            return (
            <>
                  <Navbar />
                  <div className="newSchedule_container">
                              <table>
                                    <>
                                          {authState.isDirection && listOfPlannings.some(planning => planning.planning_id === id) ? listOfPlannings.map((value, key) => {
                                                
                                                
                                                if (value.planning_id === id) { 
                                                      if (isPeriodeFound) {
                                                            return
                                                      } else {
                                                       
                                                            isPeriodeFound = true
                                                            return (

                                                      <>
                                                            <caption>Période du {value.periode}</caption>
                                                            <thead>
                                                                  <tr className="column_name">
                                                                        <th>Nom</th>
                                                                        <th>Fonction</th>
                                                                        <th>Lundi</th>
                                                                        <th>Mardi</th>
                                                                        <th>Mercredi</th>
                                                                        <th>Jeudi</th>
                                                                        <th>Vendredi</th>
                                                                        <th>Samedi</th>
                                                                        <th>Dimanche</th>
                                                                        <th>TOTAL</th>
                                                                  </tr>
                                                            </thead>

                                                      </>
                                                )    
                                                      }
                                                
                                          }
                                          
                                    }) : listOfPlannings.some(planning => planning.planning_id === id) ? listOfPlannings.map((value, key) => {
                                          if (value.nom_employe === authState.nom_complet && value.planning_id === id) {
                                                if (isPeriodeFound) {
                                                            return
                                                } else {
                                                      
                                                      return (
                                                      <>
                                                            <caption>Période du {value.periode}</caption>
                                                            <thead>
                                                                  <tr className="column_name">
                                                                        <th>Nom</th>
                                                                        <th>Fonction</th>
                                                                        <th>Lundi</th>
                                                                        <th>Mardi</th>
                                                                        <th>Mercredi</th>
                                                                        <th>Jeudi</th>
                                                                        <th>Vendredi</th>
                                                                        <th>Samedi</th>
                                                                        <th>Dimanche</th>
                                                                        <th>TOTAL</th>
                                                                  </tr>
                                                            </thead>
                                                      </>
                                                )
                                                      }
                                               
                                          }
                                    }) : <div>Pas d'emploi du temps à afficher !</div>}
                                          
                                          
                              
                              
                              <tbody>
                                         
                                          {authState.isDirection && listOfPlannings.some(planning => planning.planning_id === id) ? listOfPlannings.map((value, key) => {
                                                if (value.planning_id === id) {

                                                      let keyString = "employee_row_" + key.toString();
                                                      
                                                      return (
                                                            
                                                            <tr className="employee_row" id={keyString} key={key}>
                                                                  <td>{value.nom_employe}</td>
                                                                  <td>{value.fonction}</td>
                                                                  <td>
                                                                        <span className="spanInput">{value.lundi[0]} - {value.lundi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.lundi[2]} - {value.lundi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.mardi[0]} - {value.mardi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.mardi[2]} - {value.mardi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.mercredi[0]} - {value.mercredi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.mercredi[2]} - {value.mercredi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.jeudi[0]} - {value.jeudi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.jeudi[2]} - {value.jeudi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.vendredi[0]} - {value.vendredi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.vendredi[2]} - {value.vendredi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.samedi[0]} - {value.samedi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.samedi[2]} - {value.samedi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.dimanche[0]} - {value.dimanche[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Repas
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.dimanche[2]} - {value.dimanche[3]}</span>
                                                                  </td>
                                                                  <td>{value.total_horaires}</td>
                                                                  {tdModificationState === 2 ? (<td></td>) : <td onClick={() => { planningModificationStart(key) }}>Modifier</td>}
                                                                  {tdModificationState === 2 ? (
                                                                        <td onClick={() => {modifyPlanningObject(key)}}>Envoyer</td>
                                                                  ) : <td></td>}
                                                            </tr>
                                                      )
                                                     
                                                };
                                    // eslint-disable-next-line array-callback-return
                                    }) : authState.nom_complet && listOfPlannings.some(employee => employee.nom_employe === authState.nom_complet) ? listOfPlannings.map((value, key) => {
                                          if (value.nom_employe === authState.nom_complet && value.planning_id === id) {
                                                if (isPlanningFound) {
                                                            return
                                                } else {
                                                      isPlanningFound = true
                                                      return (
                                          /* Code pour rendre la table de l'employé */
                                          (<tr className="employee_row" key={key}>
                                                      <td>{value.nom_employe}</td>
                                                <td>{value.fonction}</td>
                                                      <td>
                                                            <span>{value.lundi[0]} - {value.lundi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.lundi[2]} - {value.lundi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.mardi[0]} - {value.mardi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.mardi[2]} - {value.mardi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.mercredi[0]} - {value.mercredi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.mercredi[2]} - {value.mercredi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.jeudi[0]} - {value.jeudi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.jeudi[2]} - {value.jeudi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.vendredi[0]} - {value.vendredi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.vendredi[2]} - {value.vendredi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.samedi[0]} - {value.samedi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.samedi[2]} - {value.samedi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.dimanche[0]} - {value.dimanche[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                                  Repas
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.dimanche[2]} - {value.dimanche[3]}</span>
                                                      </td>
                                                      <td>{value.total_horaires}</td>
                                                </tr>)
                                                );
                                                }
                                          
                                                
                                          }
                                          }) : <div>Pas d'emploi du temps pour le moment !</div>}
                              </tbody>
                              
                              </>
                        </table>
                  </div>
            </>
            
      );
      }


      
      

      
};

export default DisplayedSchedule;
