export interface FarmerProps {
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    groupName?: string; // Added groupName property
    createdAt: string | Date;
  }

  export class Farmer {
    [x: string]: string | Date | undefined;
    _id: string;
    id: string;
    fullName: string;
    mobileNumber: string;
    groupId?: string;
    groupName?: string; // Added groupName property
    createdAt: Date;

    constructor({ 
      id, 
      fullName, 
      mobileNumber,  
      groupId, 
      groupName, // Added groupName to constructor
      createdAt, 
      _id 
    }: FarmerProps & { _id: string }) {
      this._id = _id;
      this.id = id;
      this.fullName = fullName;
      this.mobileNumber = mobileNumber;
      this.groupId = groupId;
      this.groupName = groupName; // Initialize groupName
      this.createdAt = new Date(createdAt);
    }
  }
