import { Request, Response, NextFunction } from "express";
import Users from "../../models/User";

export default function checkRole(role: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.body.id
        
        if(!userId){
            res.status(401).json({message:"Отказано, не обнаружено id пользователя."})
        }

        const user = await Users.findById(userId);

        if(!user){
            res.status(404).json({ message: "Пользователь не найден" });
        }

        console.log(user)

        if(role.includes(user!.role)){
            next();
        } else {
            res.status(403).json({message:"Отказано, несоответствующая роль."})
        }
    }
}