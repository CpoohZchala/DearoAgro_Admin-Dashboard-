export interface FarmerProps {
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    groupName?: string; 
    createdAt: string | Date;
    password?: string; 
    branchName?: string;
  }

  export class Farmer {
    [x: string]: string | Date | undefined;
    _id: string;
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    groupName?: string; 
    createdAt: Date;
    password?: string;
    branchName?: string;

    constructor({ 
      id, 
      fullName, 
      mobileNumber,  
      groupId, 
      groupName, 
      createdAt, 
      _id, 
      password, 
      branchName
    }: FarmerProps & { _id: string }) {
      this._id = _id;
      this.id = id;
      this.fullName = fullName;
      this.mobileNumber = mobileNumber;
      this.groupId = groupId;
      this.groupName = groupName; 
      this.createdAt = new Date(createdAt);
      this.password = password; 
      this.branchName = branchName; 
    }
  }
