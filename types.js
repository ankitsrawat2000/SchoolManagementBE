import { z } from 'zod';

export const CreateSchoolSchema = z.object({
    schoolName : z.string().trim().min(3).max(100),
    schoolAddress : z.string().trim().min(3).max(100),
    schoolLatitude : z.number().min(-90).max(90),
    schoolLongitude : z.number().min(-180).max(180),
})

export const UserSchema = z.object({
    userLatitude : z.number(),
    userLongitude : z.number()
})