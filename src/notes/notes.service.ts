import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './schemas/note.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}
  async create(noteDto: CreateNoteDto, userId: ObjectId) {
    const data = { ...noteDto, userId };
    const createdCat = new this.noteModel(data);
    return createdCat.save();
  }
  async findAll() {
    return this.noteModel.find().exec();
  }
  async findByUserId(userId: ObjectId) {
    return this.noteModel.findById(userId);
  }
  async update(id: string, updateNote: UpdateNoteDto): Promise<Note> {
    const updatedUser = await this.noteModel
      .findByIdAndUpdate(id, updateNote, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }
  async delete(id: string) {
    const deleteNote = await this.noteModel
      .findByIdAndDelete(id);
    if (!deleteNote) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
        success: true,
        message:"Note deleted successfully"
    }
  }
}
