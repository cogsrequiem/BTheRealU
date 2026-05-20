import z from "zod";

const postGoalSchema = z.object({
name:z.string().trim().min(3, "Name must be at least 3 character long."),
icon_url:z.string().url('Must be a valid url.'),
start_date:z.string().datetime(),
end_date:z.string().datetime(),
}).refine(data => new Date(data.end_date) > new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"]
})
const patchGoalSchema = z.object({
name:z.string().trim().min(3, "Name must be at least 3 character long.").optional(),
icon_url:z.string().url('Must be a valid url.').optional(),
start_date:z.string().datetime().optional(),
end_date:z.string().datetime().optional(),
}).refine(
    data => {
        if(!data.start_date || !data.end_date) return true;

        return new Date(data.end_date) > new Date(data.start_date) },
         {
  message: "End date must be after start date",
  path: ["end_date"]
})

export{postGoalSchema, patchGoalSchema}