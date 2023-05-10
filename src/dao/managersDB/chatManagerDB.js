import chatModel from "../models/chat.model.js";

export default class ChatManagerDB {
  getChats = async () => {
      try {
        const chats = chatModel.find();
        return chats;
      } catch (error) {
        console.log(error);
      }
  };
  
  createChats = async (chat) => {
    try {
      const chats = await chatModel.create(chat);
      return chats;
    } catch (error) {
      console.log(error);
    }
  };
}
