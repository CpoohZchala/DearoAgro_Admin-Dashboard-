export interface FarmerProps {
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    createdAt: string | Date;
  }
  
  export class Farmer {
    [x: string]: string | Date | undefined;
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    createdAt: Date;
  
    constructor({ 
      id, 
      fullName, 
      mobileNumber,  
      groupId, 
      createdAt 
    }: FarmerProps) {
      this.id = id;
      this.fullName = fullName;
      this.mobileNumber = mobileNumber;
      this.groupId = groupId;
      this.createdAt = new Date(createdAt);
    }
  }
  