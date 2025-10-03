// import { PartialType } from '@nestjs/swagger';
// import { CreateBookDto } from './create-book.dto';

// export class UpdateBookDto extends PartialType(CreateBookDto) {}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @MinLength(1)
  author?: string;

  @ApiProperty({ example: 'BOOK-001' })
  @IsString()
  @MinLength(1)
  sku?: string;

  @ApiProperty({ example: 'fantasy' })
  @IsString()
  genre?: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiProperty({ example: 'A story of decadence and excess.' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 2015 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  year?: number;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  coverImage?: any;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;
}
