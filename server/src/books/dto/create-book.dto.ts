import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @MinLength(1)
  author: string;

  @ApiProperty({ example: 'BOOK-001' })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({ example: 'fantasy' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 'A story of decadence and excess.' })
  @IsString()
  // @MinLength(1)
  description: string;

  @ApiProperty({ example: 2015 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  @IsString()
  coverImage?: any;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;
}
