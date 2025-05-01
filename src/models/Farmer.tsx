export interface FarmerProps {
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    createdAt: string | Date;
  }
  
  export class Farmer {
    [x: string]: string | Date | undefined;
    _id: string;
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
      createdAt, 
      _id 
    }: FarmerProps & { _id: string }) {
      this._id = _id;
      this.id = id;
      this.fullName = fullName;
      this.mobileNumber = mobileNumber;
      this.groupId = groupId;
      this.createdAt = new Date(createdAt);
    }
  }
