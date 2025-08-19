export interface Crop {
  _id?: string;
  name: string;
  category: string;
  imageUrl: string;
}

export const CROP_CATEGORIES = [
  "ධාන්‍ය බෝග",
  "මුලබෝග", 
  "පලතුරු බෝග",
  "එළවළු බෝග",
  "පාන බෝග",
  "ඖෂධීය සහ සුගන්ධ බෝග",
] as const;

export type CropCategory = typeof CROP_CATEGORIES[number];