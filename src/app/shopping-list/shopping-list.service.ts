import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService{
    startedEditing  = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apple',22),
        new Ingredient('Orange',20)
    ];
    

    changedIngredients = new Subject<Ingredient[]>();


    getIngredinets(){
        return this.ingredients.slice();
    }

    getIngredientById(index:number){
        return this.ingredients[index];
    }

    addIngredients(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.changedIngredients.next(this.ingredients.slice());
    }

    addIngredientsFromRecipes(ingredient:Ingredient[]){
        this.ingredients.push(...ingredient);
        this.changedIngredients.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient){
        this.ingredients[index] = newIngredient;
        this.changedIngredients.next(this.ingredients.slice());
    }

    deleteIngredients(index: number){
        this.ingredients.splice(index,1);
        this.changedIngredients.next(this.ingredients.slice());
    }
}