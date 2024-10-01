import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private noteService: NotesService) {}
  @Post('create-note')
  @UseGuards(AuthGuard)
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user;
    return this.noteService.create(createNoteDto, userId);
  }
  @Get()
  @UseGuards(AuthGuard)
  findNotes() {
    return this.noteService.findAll();
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  updateNotes(@Param('id') id: string, @Body() updateNote: UpdateNoteDto) {
    return this.noteService.update(id, updateNote);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteNotes(@Param('id') id: string) {
    return this.noteService.delete(id);
  }
}
