import { MercadoPagoConfig, Preference } from 'mercadopago';
import Doctor from '../models/Doctor.js'; // Importamos el modelo Doctor

const client = new MercadoPagoConfig({
    //accessToken: 'APP_USR-3831322869194403-062616-3cfb47a234c46324ffaf5e51c6395076-256484141' //acces token de rosio
    accessToken: 'APP_USR-2366408993859862-061818-bf28d279bcb4447922f1f01d30b90235-48718684' //acces token de maurisio
});
//685ddb0bf8efec2d6f164433
const preferenceClient = new Preference(client);
const createPreference = async (req, res) => {
    try {
        const { idDoctor } = req.params; // obtenemos el id del doctor desde los parametros de la ruta
        const doctor = await Doctor.findById(idDoctor); // buscamos el doctor en la base de datos
        const preference = {
            items: [
                {
                    title: "Producto de ejemplo", //tittulo del pago
                    quantity: 1, // cantidad del producto
                    //este precio se deberia cambiar por el precio del doctor
                    //que no se si vendra por params o por body
                    //en el caso de que venga por params, se deberia hacer una consulta a la base de datos
                    unit_price: doctor.precioConsulta, // precio del producto, lo obtenemos del doctor
                    //unit_price: 100, // precio del producto por defecto para pruebas
                    currency_id: "ARS",
                }
            ],
            back_urls: {
                success: "https://localhost:4200/success", // deber ser https para que funcione, debemos desplegar el frontend
                failure: "http://localhost:4200/failure",
                pending: "http://localhost:4200/pending"
            },
            auto_return: "approved",
        };

        const response = await preferenceClient.create({ body: preference }); // crea la preferencia de mercado pago

        res.json({ init_point: response.init_point }); // esto nos dirigirar a la pagina de mercado pago 
        //y si lo prbamos desde postman, nos devolvera el linkque nos lleva a mercado pago

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
};

export default { createPreference };