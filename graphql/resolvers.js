const userSchema = require('../models/User');

const resolvers = {    
    hello: () => {
        return "Hola Mundo!";
    },
    User: async (_, {id}) => {
        try {
            return user = await userSchema.findById(id);
        }catch(e){
            console.log()
        }
    },
    Users: async () => {
        try{
            return await userSchema.find();
        }
        catch(e){
            console.log(e)
        }
    },  
    UsersByFilter: async (_, {filter}) => {
        try{
            let query = {};

            if(filter){
                if(filter.name){
                    // {name: "Mar"}
                    query.name = { $regex: filter.name, $options: 'i' } // 'i' se utiliza para hacer una busqueda insesible de mayusculas y minusculas
                }
                if(filter.email){
                    // {email: "juan@"}
                    query.email = { $regex: filter.email, $options: 'i'}
                }
                if(filter.lastname){
                    // {lastname: "San"}
                    query.lastname = { $regex: filter.lastname, $options: 'i' }
                }

                const users = await userSchema.find(query)
                return users;
            }

        }catch(e){
            console.log("Error obteniendo el usuario")

        }
    }

}
module.exports = resolvers