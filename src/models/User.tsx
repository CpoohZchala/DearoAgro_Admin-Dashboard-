export interface UserProps {
  id?: string;
  fullName?: string;
  mobileNumber: string;
  password: string;
  userType?: string;
  email?: string;
}

export class User {
  id?: string;
  fullName?: string;
  mobileNumber: string;
  password: string;
  userType?: string;
  email?: string;

  constructor({ id, fullName, mobileNumber, password, userType, email }: UserProps) {
    this.id = id;
    this.fullName = fullName;
    this.mobileNumber = mobileNumber;
    this.password = password;
    this.userType = userType;
    this.email = email;
  }

  toJson(): any {
    const data: any = {
      mobileNumber: this.mobileNumber,
      password: this.password,
    };

    if (this.fullName) data.fullName = this.fullName;
    if (this.userType) data.userType = this.userType;
    if (this.email) data.email = this.email;

    return data;
  }
}