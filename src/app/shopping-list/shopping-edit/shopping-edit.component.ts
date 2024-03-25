import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy{

  @ViewChild('f') slForm:NgForm;

  subscription : Subscription;
  editedIndex: number;
  editMode = false;
  editedItem: Ingredient;

  constructor(private shoppingListService:ShoppingListService){}


  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index : number) => {
        this.editedIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredientById(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onAddShoppingMaterial(form: NgForm){
    console.log(form);
    const ingName = form.value.name;
    const ingAmt = form.value.amount;
    const ingTmpArray = new Ingredient(ingName,ingAmt);
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedIndex,ingTmpArray);
    }
    else{
      this.shoppingListService.addIngredients(ingTmpArray);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingListService.deleteIngredients(this.editedIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
