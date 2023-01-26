import React from 'react';

const InfoBubble = () => {
    return (
        <div className='infoBubble'>
            <h3>Infos utiles</h3>
            <h4>Pour la période:</h4>
            <p>Pour remplir correctement le champ "Période du:", voici un schéma et un exemple:</p>
            <p>Schéma: "jj/mm/aa au jj/mm/aa"</p>
            <p>Exemple: "23/01/23 au 29/01/23"</p>
            <h4>Pour les horaires:</h4>
            <p>Si vide: <br />
                Laisser vide
            </p>
            <p>Si employé présent:
                Schéma par case : <br /><br /> "HH:mm - HH:mm" <br /> <br />
                Exemple pour un employé, le lundi, commençant le matin, première case avant la pause : <br /> <br /> "08:00 - 13:00" <br /> <br />
                Exemple pour le même employé, le lundi, après sa pause, deuxième case du lundi : <br /><br /> "13:30 - 17:00"
            </p>
        </div>
    );
};

export default InfoBubble;