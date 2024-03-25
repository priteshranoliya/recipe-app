import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./authModel/user.model";
import { Router } from "@angular/router";

export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({
    providedIn: 'root',
})
export class AuthService{

    constructor(private http: HttpClient,
                private router: Router){}

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer : any;

    signup(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyArzJosc8RPVbVgdKjKp3Vf94rwTmGN_j8',
            {
                email: email,
                password: password,
                returnSecureToken: true,
            }
        ).pipe(
            catchError(this.handleError),
            tap((resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                )
            }))
        )
    }


    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyArzJosc8RPVbVgdKjKp3Vf94rwTmGN_j8',
            {
                email: email,
                password: password,
                returnSecureToken: true,
            }
        ).pipe(
            catchError(this.handleError),
            tap((resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
            })),

        )
    }

    autoLogin(){
        const userData : {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string,
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        },expirationDuration)
    }


    private handleAuthentication(email: string, userId:string, token: string, expiresIn: number){
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );

        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes : HttpErrorResponse){
        console.log('Error response is: ',errorRes);
        let errorMessage = 'An unknown error has occured!';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(() => new Error(errorMessage));
        }
        switch(errorRes.error.error.errors[0].message){
            case 'EMAIL_EXISTS':
                errorMessage = 'Email already taken. Choose another or log in.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email not found. Please check your email address or sign up.';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Uh-oh! It seems like your login credentials are not quite right. Please double-check your username and password and try again.';
                break;
        }
        return throwError(()=> new Error(errorMessage));
    }



}