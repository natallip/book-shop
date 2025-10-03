import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: string = 'title',
    filters: Record<string, string | number> = {},
  ): Promise<{ data: Book[]; total: number }> {
    // Определяем направление сортировки
    const orderC = sort.startsWith('-') ? 'DESC' : 'ASC'; // Если `sort` начинается с "-", выбираем убывание
    const field = sort.replace('-', ''); // Убираем "-" для получения названия поля

    const query = this.booksRepository
      .createQueryBuilder('book')
      .orderBy(`book.${field}`, orderC)
      .skip((page - 1) * limit)
      .take(limit);

    // Поиск по нескольким полям
    if (search) {
      query.andWhere(
        `(book.title LIKE :search OR book.author LIKE :search OR book.description LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    // Фильтры с точным совпадением
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.andWhere(`book.${key} = :${key}`, { [key]: value });
      }
    });

    const [data, total] = await query.getManyAndCount();

    // const [data, total] = await this.booksRepository.findAndCount({
    //   where: search ? { title: Like(`%${search}%`) } : {},
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   order: { [field]: orderC }, // Добавлено направление сортировки
    // });
    return { data, total };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async search(searchDto: SearchBooksDto): Promise<[Book[], number]> {
    const query = this.booksRepository.createQueryBuilder('book');

    if (searchDto.term) {
      query.where([
        { title: Like(`%${searchDto.term}%`) },
        { author: Like(`%${searchDto.term}%`) },
        { sku: Like(`%${searchDto.term}%`) },
      ]);
    }

    if (searchDto.sortBy) {
      const order = searchDto.sortOrder === 'DESC' ? 'DESC' : 'ASC';
      query.orderBy(`book.${searchDto.sortBy}`, order);
    }

    return query
      .skip((searchDto.page - 1) * searchDto.limit)
      .take(searchDto.limit)
      .getManyAndCount();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    // const book = await this.findOne(id);
    // Object.assign(book, updateBookDto);
    // return this.booksRepository.save(book);
    await this.booksRepository.update(id, updateBookDto);
    return this.booksRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}
