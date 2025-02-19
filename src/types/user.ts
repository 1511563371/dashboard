import axios from 'axios';

interface IUser {
  resetPassword(): Promise<void>;
}

export class User implements IUser {
  constructor(user?: { [key: string]: any }) {
    Object.assign(this, user);
  }

  ID: number;
  CreatedAt: Date;
  Email: string;
  IsActive: boolean;
  LastLoginAt: Date;
  Phone: string;
  Source: string;
  SourceVendor: string;
  SystemRoleID: number;
  Username: string;
  [others: string]: any;

  public async getUserList(params: KubePaginationRequest): Promise<KubePaginationResponse<User[]>> {
    const data: { [key: string]: any } = await axios(`user`, { params: params });
    return data as KubePaginationResponse<User[]>;
  }

  public async addUser(): Promise<User> {
    const data: { [key: string]: any } = await axios.post(`user`, this);
    return data as User;
  }

  public async updateUser(): Promise<User> {
    const data: { [key: string]: any } = await axios.put(`user/${this.ID}`, this);
    return data as User;
  }

  public async deleteUser(): Promise<void> {
    await axios.delete(`user/${this.ID}`);
  }

  // IUser
  public async resetPassword(): Promise<void> {
    await axios.post(`user/${this.ID}/reset_password`, this);
  }
}
