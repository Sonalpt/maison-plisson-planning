import React, { useRef} from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import moment from "moment";

const NewSchedule = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      const id = params ? parseInt(params.id) : 0;


      let navigate = useNavigate();

      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);
      const planningsToFetch: any = [];
      
      const periodeInputRef = useRef<HTMLInputElement>(null);

      useEffect(() => {
            if (!localStorage.getItem("accessToken")) {
                  navigate("/");
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
                                          .get("http://localhost:3001/employee",{
                                    headers: { accessToken: localStorage.getItem("accessToken") },
                              })
                                          .then((response) => {
                                                setListOfEmployees(response.data.listOfEmployees);
                                          })
                                    axios
                                          .get("http://localhost:3001/planning",{
                                    headers: { accessToken: localStorage.getItem("accessToken") },
                              })
                                          .then((response) => {
                                                setListOfPlannings(response.data.listOfPlannings);
                                                setIsLoaded(true);
                                                console.log(listOfPlannings)
                                          });
                              }
                        })
            }

    
    
      }, [!listOfEmployees]);


      // fonction pour créer un objet "planning" (représentant une ligne du tableau)
      function createPlanningObject(employee: any, key: number) {
            let total:number = null;
            
            let planning: Record <string, any>= {
                  planning_id: listOfPlannings.length,
                  periode: (document.querySelector("caption input:first-child") as HTMLInputElement).value,
                  nom_employe: employee.nom_employee,
                  fonction: employee.fonction,
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
                        if (planning[days[i]][0] === "" || planning[days[i]][1] === "") {
                              continue;
                        } else {
                                    let horaires = planning[days[i]];
                                    for (let j = 0; j < horaires.length; j += 1) {
                                          let timeArray = [];
                                          let times = horaires[j].split(" - ");
                                          timeArray.push(times[0], times[1]);
                                          planning[days[i]] = [...planning[days[i]], ...timeArray]
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
                                          console.log(duration);
                                          total += duration;
                                    }
                              }
                        }
                        
                  }
                  planning.total_horaires = total;
            }
            console.log(total)
            planning.total_horaires = total;
            let totalInput = document.querySelector(`#employe_row_${key} td:nth-child(10)`)
            totalInput.textContent = total.toString();
            planningsToFetch.push(planning);
            console.log(planningsToFetch)
            const tdToDelete = document.querySelector(`#employe_row_${key} td:nth-child(11)`);
            tdToDelete.remove();
      }

      

      const onSubmit = () => {
            axios
                  .post(
                  "http://localhost:3001/planning",
                  {
                  plannings: planningsToFetch
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


      return (
            <>
                  <Navbar />
                  <div className="newSchedule_container">
                        <table>
                              <caption>
                                    Période du : <input ref={periodeInputRef}></input>
                              </caption>
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
                              <tbody>

                              
                              
                              {listOfEmployees.map((employee, key) => {
                                    return (    
                                          <tr className="employee_row" id={`employee_row_${key}`} key={key}>
                                    <td>{employee.nom_employee}</td>
                                          <td>{employee.fonction }</td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                    <td>
                                          <input></input> Repas <input></input>
                                    </td>
                                                <td>00</td>
                                                <td onClick={(event) => createPlanningObject(employee, key)}>ajouter au tableau</td>

                              </tr>
                                    )
                              })}
                                    </tbody>
                              
                                    
                              
                              
                              
                        </table>
                  </div>
                  <div className="ENVOYER" onClick={onSubmit}>ENVOYER</div>
            </>
      );
};

export default NewSchedule;
