const user = require("../models/user");
const {faker} = require("@faker-js/faker")

exports.createUsers = async(userNomber) => {
    try{
        const allUsers = [];

        for(let i=1;i<=userNomber;i++){
            const temp = user.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                password:"password",
                bio:faker.lorem.sentence(10),
                avatar:{
                    public_id:faker.system.fileName(),
                    url:faker.image.avatar()
                }
            })

            allUsers.push(temp);
        }

        await Promise.all(allUsers);
        process.exit(1);

    }catch(err){
        console.log("errocre occured in user seeders")
        console.log(err);
    }
}


