#Basic UI layout design for the web application!

users = ["user_01","user_02","user_03","user_04"]

while(1):
     print("\nMembers in the chat:")
     for i in users:
          print(i)
     userName = input("\nEnter the name of user: ")

     while(1):
          print("\nLogged in as: "+userName)
          print("1. View user messages")
          print("2. Compose new message") 
          print("3. Delete message")
          print("4. Delete message for all")
          print("5. Login as another user")
          myChoice = int(input("\nEnter your choice: ")) 

          if myChoice == 1:
               print("\nLogged in as: "+userName)
               print("Chat logs for: "+ userName)
               #Method to view messages called here
               print("msg_id_001, user_02: Hello")
               print("msg_id_002, user_01: Hi !")
               print("msg_id_003, user_03: Billa")
               print("msg_id_004, user_02: Ishpreet this sidee")

          elif myChoice == 2:
               print("\nLogged in as: "+userName)
               msg = input("Enter your message: ")
               #method to update messages called here
               print("Message sent!")

          elif myChoice == 3:  
               print("\nLogged in as: "+userName)
               msg = input("Enter the message id for deletion: ")
               #method to delet msg for user called here
               print("Message deleted for "+userName)

          elif myChoice == 4: 
               print("\nLogged in as: "+userName)
               msgId = input("Enter the message id for deletion: ")
               #method to delete msg for all called here
               print("Message deleted for all")

          elif myChoice == 5:
               break 

