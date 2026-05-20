import { prisma } from "../config/db.js";


const getDailyGoalController = async (req, res) => {
const {goalId} = req.params;



  try {

    const goal= await prisma.goal.findUnique({
      where: {id: goalId}
    })
    const dailyGoals = await prisma.dailyGoal.findMany({
    where: {id_goal:goalId}
})

const start_date = goal.start_date;
const end_date = goal.end_date;

const baseDiff = Math.abs(end_date - start_date);
const daysDiff = Math.floor(baseDiff/(1000*60*60*24))

console.log( daysDiff)

res.status(200).json({
    status: "Success",
    data: {goal,total_days:daysDiff, dailyGoals}

})

  } catch(error) {
    console.log(error.message);
     res.status(500).json({
        status:"failed",
        message: "Goal can't be found"
    })
  }


}

const postDailyGoalController = async (req, res) => {

  const {completed, mood, notes} = req.body;
  const goalId = req.params.goalId
  const today = new Date().toISOString().split('T')[0];



  try {

    const existing = await prisma.dailyGoal.findFirst({
      where: {id_date: today,
        id_goal:goalId
      }
    })

    if (existing) {
      return res.status(400).json({message: "Daily Goal already achieved !"})
    }

    const dailyGoal = await prisma.dailyGoal.create({
    data: {id_goal: goalId,
      id_date: today,
      completed,
            mood,
            notes}
})


res.status(201).json ({
    status: "Success",
    data:{
      id_goal: dailyGoal.id_goal,
      id_date: dailyGoal.id_date,
      completed: dailyGoal.completed,
      mood: dailyGoal.mood,
      notes: dailyGoal.notes
    }
})

  } catch(error) {
    console.log(error);
    console.log(error.message);
     res.status(500).json({
        status:"failed",
        message: "Creation failed"
    })
  }


}

const patchDailyGoalController = async(req, res) => {
  const {completed, mood, notes} = req.body;

  const {dailyGoalId} = req.params;

  console.log(completed, mood, notes, dailyGoalId)
  try {
     const verifyDailyGoal = await prisma.dailyGoal.findUnique({
    where: {id: dailyGoalId}
  })

  if (!verifyDailyGoal) {
    return res.status(404).json({message:"Goal not found."})
  }

  const patchDailyGoal = await prisma.dailyGoal.update({
    where : {id: dailyGoalId}, data:{
      completed: completed !== undefined ? completed : verifyDailyGoal.completed,
mood: mood !== undefined ? mood : verifyDailyGoal.mood,
notes: notes !== undefined ? notes : verifyDailyGoal.notes
    }
          
  })

  res.status(200).json({status: "Success", data:{patchDailyGoal}, Message:`DailyGoal modified.`})
  } catch(error) {
    console.log(error.message);
     res.status(500).json({
        status:"failed",
        message: "Modification failed"
    })
  }
 
}


export {getDailyGoalController, postDailyGoalController, patchDailyGoalController}