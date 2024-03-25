import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  @Output() featureSelected = new EventEmitter<string>();


  isAuthenticated: boolean = false;
  userSub : Subscription;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService
             ){}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user) => {
        if(user){
          this.isAuthenticated = true;
        }
        else{
          this.isAuthenticated = false;
        }
      }
    )     
  }
  



  onSelect(feature:string){
    this.featureSelected.emit(feature);
  }

  onSaveData(){
    this.dataStorageService.storedRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
    
  }

  

  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }


}
