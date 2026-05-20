import { prisma } from "../config/db.js";


function verifyGoal(goal, userId) {
    if(!goal) {
            throw new Error("GOAL_NOT_FOUND");
        }

        if (goal.id_user !== userId) {
           throw new Error("NOT_YOUR_GOAL")
        }
}

const getGoals = async (req, res)  => {

    const id_user = req.userId

    const {id} = req.params

    try {
        const userGoal = await prisma.goal.findMany({
            where: {id_user:id_user}
        })

        console.log(userGoal)

        if (userGoal.length === 0) {
            res.status(200).json({ status: "success", goals: [], message: "No goals set yet !"})
        }

        

        res.status(200).json({
            status: "success",
            data: {
                goals: userGoal
            }
        })


    } catch(err) {
        res.status(403).json({message:"fetching failed"})
    }

}

const postGoals = async (req, res) => {

    const {name, icon_url, start_date, end_date} = req.body;
     const idUser= req.userId
     
 try {
    const goal = await prisma.goal.create({
        data: {
            name,
            creator: {
                connect: {id: idUser}
            },
            icon_url,
            start_date,
            end_date
        }
    })

   

    res.status(201).json({
        status: "succes",
        data:{
            id: goal.id,
            id_user: goal.idUser,
            name: goal.name,
            icon_url: goal.icon_url,
            start_date: goal.start_date,
            end_date: goal.end_date
        }
    })


 } catch(error){

    console.log("Erreur complète", error);
    console.log("Message d'erreur", error.message)
    res.status(500).json({
        status:"failed",
        message: "Creation failed"
    })
 }
}




const patchGoals = async (req, res) => {
    const userId = req.userId
    const {id} = req.params

    try{
        const goal = await prisma.goal.findUnique({
            where: {id:id}
        })

          verifyGoal(goal, userId)

           const updatedGoal= await prisma.goal.update({
                where: {id:id},
                data: {
            name: req.body.name || goal.name,
            icon_url:req.body.icon_url|| goal.icon_url,
            start_date: req.body.start_date || goal.start_date,
            end_date: req.body.end_date || goal.end_date
                }
            })

            res.status(200).json({status: "Success", data:{updatedGoal}, Message:`Goal modified.`})

    }catch(error) {
        console.log(error.message)

        if(error.message === "GOAL_NOT_FOUND") {
            return res.status(404).json({message:"Goal not found."})
        }

        if(error.message === "NOT_YOUR_GOAL") {
            return res.status(403).json({message:"Not your goal."})
        }
        res.status(500).json({
        status:"failed",
        message: "Modification failed"
    })
    }
}

const deleteGoals = async (req, res) => {

    const userId = req.userId
    const {id} = req.params

    try{
        
        const goal = await prisma.goal.findUnique({
            where: {id:id}
        })

        verifyGoal(goal, userId);


        const deleteGoal = await prisma.goal.delete({
            where: {id}
        })

    res.status(200).json({status: "Success", Message:`Goal ${id} from user ${userId} has been deleted`})

    } catch(error) {
        console.log("Message d'erreur", error.message)

        if(error.message ==="GOAL_NOT_FOUND") {
            return res.status(404).json({message:"Goal not found."})
        }

        if(error.message ==="NOT_YOUR_GOAL") {
            return res.status(403).json({message: "Not your goal."})
        }
        res.status(500).json({
        status:"failed",
        message: "Delete failed"
    })
    }
    

}

export {getGoals, postGoals, patchGoals, deleteGoals}