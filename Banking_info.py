import math
print ("Welcome to Moon Bank")
def signin():
    global name # username
    global pin # password
    global cb # current balance 
    name = str(input("Please create username"))
    pin = str(input("Please enter a  4-digit pin"))
    if len(pin) == 4:
        pin = pin
    else:
        print("The pin must be 4 digits")
        newpin = str(input("Pin must be 4 digits"))
        if len(newpin) is 4:
            print("4 digit pin")
            signin()
        else:
            pin=newpin
    print("Thanks fpr creating your account and Welcome")

    def forgotpin():
        recoverpin = str(input("Please create your new 4 digit pin"))
        if len(recoverpin) != 4:
            print("The pin has to be in 4 digits")
            forgotpin()
        else:
            print("The new pin is active, please log in")
            pin= recoverpin
        
        def login():
            # us1 represents username
            # pin1 represents pin
            us1 = str(input("please enter username"))
            pin1= str(input("Please enter pin"))
            # check if the name and pin was a match
            if us1 == name and pin1 == pin:
                print("Welcome to Moon Bank"+""+name)
                print("Please choose the menu down here")
                listmenu = ("1-Deposit", "2-Transfer", "3-Check Balance", "4-Withdraw")
            
            else:
                print("Do you have the right username or pin?")
                list1 = ("1-yes","2-no")
                for a in list1:
                    print(a)
                inp = int(input("Enter your choice below"))
                if inp == 1:
                    list2 = ("1-Would you like to try again?""2-Forgot pin")
                    for i in list2:
                        print(i)
        
