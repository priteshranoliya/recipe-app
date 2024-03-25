import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";


@Injectable({
    providedIn: 'root',
})
export class DataStorageService{
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService){}

    storedRecipes(){
        const recipes = this.recipeService.getRecipes();

        this.http.
        put(
            'https://ng-recipe-book-28c31-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', 
            recipes
        )
        .subscribe(res => console.log(res));
    }

    fetchRecipes(){
        
        return this.http.get<Recipe[]>(
                'https://ng-recipe-book-28c31-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
            ).pipe(
            map(
                (recipes) => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients : recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }
            ),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }
}