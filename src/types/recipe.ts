import { TimeComponents } from './time';

export interface Recipe {
  id?: string;
  content: RecipeContent;
}

export interface RecipeContent {
  name: string;
  imageUrl?: string;
  time?: TimeComponents;
  peopleCount?: number;
  tags: string[];
  ingredients: string[];
  steps: RecipeStep[];
}

export interface RecipeStep {
  text: string;
  imageUrls: string[];
}
