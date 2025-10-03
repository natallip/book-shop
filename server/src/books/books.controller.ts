import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RoleGuard } from '../auth/role.guards';
import { FileInterceptor } from '@nestjs/platform-express';
//import * as path from 'node:path';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as process from "node:process";

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book successfully created' })
  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'title',
        'author',
        'sku',
        'genre',
        'description',
        'year',
        'price',
        'stock',
        'coverImage',
      ],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        sku: { type: 'string' },
        genre: { type: 'string' },
        description: { type: 'string' },
        year: { type: 'integer' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        coverImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateBookDto,
  ) {
    const imageUrl = file ? `/uploads/books/${file.filename}` : null;
    return this.booksService.create({ ...dto, coverImage: imageUrl });
  }

  // @ApiOperation({ summary: 'Create a new book' })
  // @ApiResponse({ status: 201, description: 'Book successfully created' })
  // @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  // @Post()
  // create(@Body() createBookDto: CreateBookDto) {
  //   return this.booksService.create(createBookDto);
  // }

  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated books' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'title',
    @Query('filters') filters: Record<string, string | number> = {},
  ) {
    return this.booksService.findAll(page, limit, search, sort, filters);
  }

  @ApiOperation({ summary: 'Get a book by id' })
  @ApiResponse({ status: 200, description: 'Returns a book' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    return {
      ...book,
      coverImage: `/uploads/books/${book.coverImage}`,
    };
  }

  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book successfully updated' })
  // @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        // 'title',
        // 'author',
        // 'sku',
        // 'genre',
        // 'description',
        // 'year',
        // 'price',
        // 'stock',
        // 'coverImage',
      ],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        sku: { type: 'string' },
        genre: { type: 'string' },
        description: { type: 'string' },
        year: { type: 'integer' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        coverImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    console.log('updateBookDto', updateBookDto);
    const baseUrl = process.env.BASE_URL;
    const imageUrl = file
      ? `${baseUrl}/api/uploads/books/${file.filename}`
      : null;
    console.log('imageUrl', imageUrl);
    return this.booksService.update(id, {
      ...updateBookDto,
      coverImage: imageUrl,
    });
  }

  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book successfully deleted' })
  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
  //
  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './uploads/books',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = path.extname(file.originalname);
  //         cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return { imagePath: `/uploads/books/${file.filename}` };
  // }
}
