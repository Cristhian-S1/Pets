import * as modeloAuth from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const logeo = await modeloAuth.loginModelo(email, password);

    if (!logeo) {
      return res.status(401).json({cod: 401, msj: "Email o contrasena incorrectos", datos: null});
    }

    const token = jwt.sign(
      {
        id: logeo.us_id,
        email: logeo.us_email,
        contacto: logeo.us_contacto,
      },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.json({cod: 200, msj: "Login exitoso", datos: {usuario: logeo, token: token} } );
  } catch (error) {
    console.error("Error en login: ", error);
    res.status(500).json({cod: 500, msj: "Error en el login", datos: null});
  }
};

export async function register(req,res){
  try{
    const {us_nombre,us_email,us_contrasena, us_contacto} = req.body;

    if(!us_nombre || !us_email || !us_contrasena || !us_contacto){
      return res.status(400).json({cod: 400, msj: "Datos incompletos", datos: null});
    }

    console.log("Entra", us_email, us_nombre, us_contrasena, us_contacto);
    const existente = await modeloAuth.registerCheck(us_email);

    if(existente){
      return res.status(409).json({cod: 409, msj: "El email ya está registrado", datos: null});
    }

    const result = await modeloAuth.register(us_nombre, us_email, us_contrasena, us_contacto);

    res.json({cod: 201, msj: "Usuario registrado exitosamente", datos: result});
  }catch(error){
    console.error("Error en registro:", error);
    res.status(500).json({cod: 500, msj: "Error en el servidor", datos: null});
  }
}

export const protegido = async (req, res) => {
  return res.json({cod: 200, msj: "You have access", datos: null});
};
