import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { UserService } from '../user/user.service.js';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(private userSevice: UserService){}


  async validateUser(username: string, password: string){
    const user = await this.userSevice.findByUsername(username);
    if(!user) throw new UnauthorizedException("User not found!");
    const isPasswordMatch = await compare(password, user.passwordHashed)
    if (!isPasswordMatch) throw new UnauthorizedException("Invalid credentials")
    
    return {id: user.id};
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
