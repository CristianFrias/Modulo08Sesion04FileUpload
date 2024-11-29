const express = require("express");
const path = require("path"); // DEPENDENCIA NATIVA
const fileupload = require("express-fileupload")
const { v4: uuid } = require("uuid")
const app = express();
const port = 3_000;

app.use(express.json());
app.use(fileupload({ createParentPath: true }));

app.use("/public", express.static(`${__dirname}/public`));

app.listen(port, () => console.log(`Aplicación en ejecución, por el puerto ${port}`));

app.get("/", (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`)
})

app.post("/registro", async (request, response) => {
    console.log(request.body);
    console.log(request.files);

    if (request.files) {
        const archivo = request.files.foto;
        const fileName = uuid();
        const { ext } = path.parse(request.files.foto.name);

        if (archivo.size > 9_000_000) {
            return response.status(422).json({ message: "El archivo excede los 5 MB."})
        }

        if (archivo.mimetype != "image/jpg" && archivo.mimetype != "image/png" ) {
            return response.status(422).json({ message: "Subir un archivo JPG o PNG."})
        }

        await archivo.mv(`${__dirname}/public/images/${fileName}${ext}`);
    }
    
})