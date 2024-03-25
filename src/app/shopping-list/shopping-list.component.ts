import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
  // providers: [ShoppingListService]
})
export class ShoppingListComponent implements OnInit, OnDestroy{

  ingredients: Ingredient[];
  private ingredientSubscription: Subscription;

  constructor(private shoppingListService:ShoppingListService){
  }

    ngOnInit(){
      this.ingredients = this.shoppingListService.getIngredinets();
      this.ingredientSubscription = this.shoppingListService.changedIngredients.subscribe(
        (ingredientsToSubscribe:Ingredient[]) => {
          this.ingredients = ingredientsToSubscribe;
        }
      );

      // for(let i=0; i<this.ingredients.length; ++i){
      //   console.log(this.ingredients[i].name);
      //   console.log(this.ingredients[i].amount);
      // }


    }

    ngOnDestroy(): void {
      this.ingredientSubscription.unsubscribe();
    }

    onEditItem(index:number){
      this.shoppingListService.startedEditing.next(index);
    }

    


  // finalIngredientsArray(ingredient:Ingredient){
  //   this.ingredients.push(ingredient);
  // }

  generatePDF() {
    const elementToPrint: any = document.getElementById('shoppinListPdf') as HTMLElement;
  
    html2canvas(elementToPrint, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const height = canvas.height * 210 / canvas.width;
  
      pdf.setTextColor(0, 0, 0); 
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22); 
      pdf.text('Shopping List', 105, 10, { align: 'center' }); 

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 20, 210, height);
      pdf.save('shopping-list.pdf');
    });
  }
  




  
}
