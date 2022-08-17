import { RepositoryService } from './../repository/repository.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TesteService {
  constructor(private readonly repositoryService: RepositoryService) {}
  async teste(req: any) {
    const { id } = req.user;
    const data = await this.repositoryService.findById(id);
    if (data.Refresh_Token === 'null') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return data;
  }
}
