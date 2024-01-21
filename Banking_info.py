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
        
        