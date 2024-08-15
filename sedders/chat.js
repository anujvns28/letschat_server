const Chat = require("../models/chat");
const Messeage = require("../models/messeage");
const user = require("../models/user");
const {faker, simpleFaker} = require("@faker-js/faker")

exports.createSingleChats = async(numChats) => {
   try{
    const users = await user.find().select("_id");

   

    const chatsPromise = [];

    for(let i=0; i<users.length; i++){
        for(let j=i+1; j<users.length; j++){
            chatsPromise.push(
                Chat.create({
                    name : faker.lorem.words(2),
                    members:[users[i],users[j]]
                })
            )
        }
    }

    await Promise.all(chatsPromise)

    console.log("chat created successfull")
    process.exit(1);

   }catch(err){
    console.log(err,"error occured in single chats seeder")
    process.exit(1);
   }
}

exports.createGroupChats = async(numChats) => {
    try{
     const users = await user.find().select("_id");
 
     const chatsPromise = [];
 
     for(let i=0;i<numChats;i++){
        const numMembers = simpleFaker.number.int({min:3,max:users.length})
        const members = [];

        for(let i=0;i<numMembers;i++){
            const randomIndex = Math.floor(Math.random()*users.length);
            const randomUser = users[randomIndex];

            if(!members.includes(randomUser)){
                members.push(randomUser);
            }
        }

        const chat = Chat.create({
            groupChat:true,
            name:faker.lorem.word(1),
            members,
            createor:members[0]
        })
     }
 
     await Promise.all(chatsPromise)
 
     console.log("chat created successfull")
     process.exit(1);
 
    }catch(err){
     console.log(err,"error occured in single chats seeder")
     process.exit(1);
    }
 }

 exports.createMessages = async(numMessages) => {
    try{
     const users = await user.find().select("_id");
     const chats = await Chat.find().select("_id");
 
     const messagePromise = [];

     for(let i=0;i<numMessages;i++){
        const randomUser = users[Math.floor(Math.random()*users.length)];
        const randomChat = chats[Math.floor(Math.random()*chats.length)];

        messagePromise.push(
            Messeage.create({
                chat:randomChat,
                sender:randomUser,
                contant:faker.lorem.sentence()
            })
        )
     }
 
     
 
     await Promise.all(messagePromise)
 
     console.log("messages created successfull")
     process.exit(1);
 
    }catch(err){
     console.log(err,"error occured in single chats seeder")
     process.exit(1);
    }
 }

 exports.createMessagesInChats = async(chatId,numMessages) => {
    try{
     const users = await user.find().select("_id");
 
     const messagePromise = [];
     
     for(let i=0;i<numMessages;i++){
        const randomUser = users[Math.floor(Math.random()*users.length)];

        messagePromise.push(
            Messeage.create({
                chat:chatId,
                sender:randomUser,
                contant:faker.lorem.sentence()
            })
        )
     }

     
 
     await Promise.all(messagePromise)
 
     console.log("chat created successfull")
     process.exit(1);
 
    }catch(err){
     console.log(err,"error occured in single chats seeder")
     process.exit(1);
    }
 }


