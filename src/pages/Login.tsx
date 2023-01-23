import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../helpers/AuthContext";
import {
      BrowserRouter as Router,
      Route,
      Routes,
      Link,
      useNavigate,
} from "react-router-dom";

const Login = () => {
      useEffect(() => {
            if (localStorage.getItem("accessToken")) {
        navigate("/planning/0");
    }
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { setAuthState } = useContext(AuthContext);

      
      const initialValues = {
            username: "",
            password: "",
      };

      let navigate = useNavigate();

      const validationSchema = Yup.object().shape({
            username: Yup.string()
                  .min(5, "Le pseudo doit faire minimum 5 charactères.")
                  .max(15, "Le pseudo doit faire maximum 15 charactères.")
                  .required("Ce champ est requis !")
                  .matches(
                        /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                        "L'utilisateur ne doit pas contenir de charactères spéciaux."
                  ),
            password: Yup.string()
                  .min(8, "Le mot de passe doit faire minimum 5 charactères")
                  .max(20, "Le mot de passe doit faire maximum 20 charactères")
                  .required("Ce champ est requis !")
                  .matches(
                        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                        "Le mot de passe doit contenir au moins 8 charactères, une majuscule, un chiffre et un charactère spécial"
                  ),
      });

      


      const onSubmit = (data: any) => {
            axios.post(
                  "http://localhost:3001/auth/login",
                  data
            ).then((response) => {
                  if (response.data.error) {
                        alert(response.data.error);
                  } else {
                        localStorage.setItem(
                              "accessToken",
                              response.data.token
                        );
                        setAuthState({
                              username: response.data.username,
                              nom_complet: response.data.complete_name,
                              fonction: response.data.function,
                              id: response.data.id,
                              isDirection: response.data.isDirection,
                              status: true,
                        });
                        console.log(response.data)
                        navigate("/planning/0");
                  }
            });
      };

      const onSubmitTest = () => {
            console.log("je suis rigolo")
      }

      return (
            <>
                  <h1>MAISON PLISSON</h1>
                  <h2>STAFF</h2>
                  <section className="login_container">
                        <Formik
                              initialValues={initialValues}
                              onSubmit={onSubmit}
                              validationSchema={validationSchema}
                        >
                              <Form className="loginContainer">
                                    {/* <div className="authComponent">
                                          <Link to="/register">
                                                S'enregistrer
                                          </Link>
                                          <Link to="/login">Se connecter</Link>
                                    </div> */}
                                    <label>Nom d'utilisateur: </label>
                                    <ErrorMessage
                                          name="username"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          id="inputCreatePost"
                                          name="username"
                                          placeholder="(Ex. John123...)"
                                    />

                                    <label>Mot de passe: </label>
                                    <ErrorMessage
                                          name="password"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          type="password"
                                          id="inputCreatePost"
                                          name="password"
                                          placeholder="Votre mot de passe..."
                                    />

                                    <button type="submit">Se connecter</button>
                              </Form>
                        </Formik>
                  </section>
            </>
      );
};

export default Login;
