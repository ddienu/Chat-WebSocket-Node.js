const express = require("express"); //=> Importa la librería de express.
const router = express.Router(); //=> Enruta los servicios web
const bcrypt = require("bcrypt");
const userSchema = require('../models/User');
const UserController = require('../controllers/UserController'); //Importando el controlador
const userController = new UserController();//Creando una nueva instancia de UserController.
const multer = require('multer');

//Asignación del método{GET, POST, PUT/PATCH, DELETE} 
//Get Method to find all users
router.get('/user',  async (req, res) => {
    //Por medio de este método se traen todos los usuarios que estén dentro de la base de datos.
    try{
        let users = await userSchema.find();
        res.json(users);
    }catch(error){
        console.log(error);
    }
});
//Get method to return an user by its id.
router.get('/user/:id', async (req, res) => {
    let idUser = req.params.id;
    let user = await userSchema.findById(idUser).catch((error) => {
        console.log(error.message);
    });
    res.json(user);
});
//Post Method
router.post('/user', async (req, res) => {
    //Con el bcrypt se encripta la contraseña que ingrese el usuario.
    const hashPassword = await bcrypt.hash(req.body.password, 10);
        
        let user = userSchema({
            name     : req.body.name,
            lastname : req.body.lastname,
            email    : req.body.email,
            userId   : req.body.userId,
            password : hashPassword
        });

    user.save().then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error.message.key);
        console.log(error.keyValue.email);
        console.log(error.keyPattern.key);
        if(error.keyPattern.email === 1){
            res.send({"status" : "error", "message" : "El email " + error.keyValue.email + " ya ha sido registrado"});
        }else if(error.keyPattern.userId === 1){
            res.send({"status" : "error", "message" : "La identificación " + error.keyValue.userId + " ya ha sido registrada"});
        }else{
            res.send({"status" : "error", "message" : "Error al registar el usuario, verifique los datos"});
        }
    })
})

//Put Method...Actualiza al usuario.
router.put('/user/:_id', userController.validateToken, async (req, res) => {
    let _id = req.params._id;

    let hashPassword;
    if(req.body.password){
        console.log(req.body.password)
        hashPassword =  await bcrypt.hash(req.body.password, 10);
    } 

    let updatedUser = {
        userId : req.body.userId,
        name : req.body.name,
        lastname : req.body.lastname,
        email : req.body.email,
        password: hashPassword
    };

    console.log(updatedUser);

    userSchema.findByIdAndUpdate(_id, updatedUser, {new : true}).then(result => {
        res.send(result);
    }).catch((error) => {
        console.log(error);
        res.send(error);
    })
})
//Delete Method
router.delete('/user/:_id', (req, res) => {

    let _id = req.params._id;

    userSchema.deleteOne({_id : _id}).then(() => {
        res.json({"status": "success", "message": "User deleted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deleting user"})
    })
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userController.login(email, password).then((result) => {
        if( result.status === 'error'){
            res.status(401).send(result);
        }else{
            res.send(result);
        }
    })    
})

//Configuración de la librería multer.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error("The provided file is not an image"));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

//Servicio web para el almacenamiento de archivos.
router.post('/upload/:id/user', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send({"status" : "error", "message" : "No file provided"})
    }

    let _id = req.params.id;

    let updateUser = {
        avatar : req.file.path
    }

    userSchema.findByIdAndUpdate(_id, updateUser, {new : true}).then(result => {
        res.send({"status" : "Success", "message" : "avatar upload successfully"});
    }).catch((error) => {
        res.send({"status" : "error", "message" : error.message});
    })
})


module.exports = router;
