export class PaginatedResultDto<T> {
    data: T[];         // The list of results (in your case, orders)
    total: number;     // Total number of records
    page: number;      // Current page number
    pages: number;     // Total number of pages
  
    constructor(data: T[], total: number, page: number, pages: number) {
      this.data = data;
      this.total = total;
      this.page = page;
      this.pages = pages;
    }
  }
  