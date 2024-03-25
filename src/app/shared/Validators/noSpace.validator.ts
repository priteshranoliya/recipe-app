import { AbstractControl, FormControl } from "@angular/forms";
import { take } from "rxjs";

export const noSpace = (control:FormControl) => {
    if(control.value != null && control.value.indexOf(' ') != -1){
        return {noSpace : true};
    }
    return null;
}

export const checkUserName = (control:AbstractControl): Promise<any> => {
    return userNameAllowed(control.value);
}

function userNameAllowed(username:string){
    const taken = ['johnsmith','kavitacharm','kaviralake'];
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            if(taken.includes(username)){
                res({checkUserName:true});
            }
            else{
                res(null);
            }
        },2000);
    })
}