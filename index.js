import express from 'express';
import { CreateSchoolSchema, UserSchema } from './types.js';
import { createSchool, getSchools } from './db.js';
import { getDistance } from './getDistance.js';
const app = express()
app.use(express.json());

app.post('/addSchool', async function (req, res){
    try{
        const parsedData = CreateSchoolSchema.safeParse(req.body);

        if(!parsedData.success){
            res.json({
                message: "Incorrect Format",
                error: parsedData.error
            })
            return;
        }

        const schoolName = parsedData.data.schoolName;
        const schoolAddress = parsedData.data.schoolAddress;
        const schoolLatitude = parsedData.data.schoolLatitude;
        const schoolLongitude = parsedData.data.schoolLongitude;
        
        const school = await createSchool(schoolName, schoolAddress, schoolLatitude, schoolLongitude);
        res.status(201).send(school);
    } catch(error){
        res.status(500).json({message: error.message});
    }
   
});

app.get('/listSchools',async function(req, res){
    try{
        const parsedData = UserSchema.safeParse(req.body);

        if(!parsedData.success){
            res.json({
                message: "Incorrect Format",
                error: parsedData.error
            })
            return;
        }

        const userLatitude = parsedData.data.userLatitude;
        const userLongitude = parsedData.data.userLongitude;

        const schools = await getSchools();
        const schoolsWithDistance = schools.map(school => {
            const distance = getDistance(userLatitude, userLongitude, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        res.json(schoolsWithDistance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);



app.listen(3000, ()=> {
    console.log('Server is running on port 3000');
});