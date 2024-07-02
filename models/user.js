import {pool} from '../db/db.js';

export class UserModel{
    getUser = async ({id})=>{
        try{
            const [users] = await pool.query("SELECT * FROM customer WHERE id=?", [id]);
            if(users.length) return users[0]
        }catch(e){
            throw new Error("error getting user")
        }
    }
    getUsers = async ()=>{
        // try{
            const {rows} = await pool.query("SELECT * FROM customer");
            if(rows.length) return rows;
            return []
        // }catch(e){
        //     throw new Error("error getting users")
        // }
    }
    createUser = async ({input})=>{
        // try{
            await pool.query("INSERT INTO customer(name, email, password) VALUES($1, $2, $3)", Object.values(input))
        // }catch(e){
        //     throw new Error("error creating user")
        // }
    }
    
}