import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service";

// GET / - get one user
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await UserService.getOne(req.params.id);
        res.status(200).json(user);
    } catch (err) { 
        
        next(err); 
    }
}

// GET / - get All users -- Admin
export async function getALL(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const allUser = await UserService.getAll();
        res.status(200).json(allUser);
    } catch (err) { 
        
        next(err); 
    }
}

// UPDATE / -update an user
export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const updated = await UserService.updateOne(req.params.id, req.body);
        res.status(201).json(updated);
    } catch(err) {
        next(err);
    }
}

// DELETE / - delete an user
export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await UserService.deleteOne(req.params.id);
        res.status(204).end();
    } catch (err) {

        next(err);
    }
}

// DELETE / - delete multiple users -- Admin
export async function deleteSomeUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const idsToDelete: string[] = req.body.ids;
        await UserService.deleteSome(idsToDelete)
        res.status(204).json({ deletedIds: idsToDelete });
    } catch (err) {
        next(err)
    }
}
