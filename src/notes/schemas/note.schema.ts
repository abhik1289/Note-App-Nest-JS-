import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type NoteDocument = Note & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true }) // Reference to User schema
  userId: Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
