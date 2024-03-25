import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('new test',
    //     'this is just a pritest.',
    //     'https://www.shutterstock.com/image-photo/notepad-your-recipe-herbs-spices-260nw-370298699.jpg',
    //     [
    //         new Ingredient('Mango',89),
    //         new Ingredient('french',889)
    //     ]),
    //     new Recipe('new test 2',
    //     'this is an another 2nd pritest.',
    //     'https://www.shutterstock.com/image-photo/notepad-your-recipe-herbs-spices-260nw-370298699.jpg',
    //     [
    //         new Ingredient('Mango',89),
    //         new Ingredient('cheese',709)
    //     ])
    // ];

    private recipes: Recipe[] = [];

    setRecipes(fetchRecipes: Recipe[]){
        this.recipes = fetchRecipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipeByid(index : number){
        return this.recipes[index];
    }

    
    constructor(private slService:ShoppingListService){}
    
    addIngToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredientsFromRecipes(ingredients);
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
    }

}